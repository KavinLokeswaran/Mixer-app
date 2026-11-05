import { getEngine } from '../audio/AudioEngine'
import {
  approach,
  MAX_SCRATCH_RATE,
  NUDGE_BUTTON,
  nudgeFromSpin,
  scratchRate,
  spinToward,
  turnsToSeconds
} from '../audio/jogMath'
import { DECK_IDS, type DeckId } from '../audio/types'
import { useSettingsStore } from '../state/settingsStore'
import { onTick } from '../ui/ticker'

/**
 * Platene (jog wheels). Hånda gir mange små bevegelser i sekundet. De samles opp her,
 * og én gang per skjermbilde regnes farten ut og sendes til decken. Da blir lyden jevn
 * selv om musa ikke sender like mange hendelser hele tiden.
 *
 * Som på en ekte platespiller har platen tyngde: motoren drar den opp i fart når du
 * trykker play, bremsen tar den ned når du stopper, og slipper du platen etter en
 * scratch, fortsetter den med farten hånda ga den (kast den bakover for en backspin).
 */

/**
 * - scratch: hånda holder i platen.
 * - nudge: hånda skyver i kanten.
 * - spin: ingen holder, men platen er ikke i vanlig fart ennå (starter, bremser eller er kastet).
 */
type JogMode = 'scratch' | 'nudge' | 'spin'

interface JogState {
  mode: JogMode | null
  /** Under scratch: der hånda har dratt platen til (sekunder i låten). */
  target: number
  /** Under spin: farten platen har (1 = normal, negativ = baklengs). */
  speed: number
  /** Kant- og hjulbevegelse siden forrige bilde (turer). */
  pendingTurns: number
  /** Skyv fra kanten/hjulet akkurat nå (0 = ingen). */
  bend: number
  /** Skyv-knappene: -1, 0 eller 1. */
  button: -1 | 0 | 1
}

/** Hvor mykt skyvet kommer og går (sekunder). */
const BEND_SMOOTHING = 0.08

const newJog = (): JogState => ({ mode: null, target: 0, speed: 0, pendingTurns: 0, bend: 0, button: 0 })
const jogs: Record<DeckId, JogState> = { A: newJog(), B: newJog() }

let stopTick: (() => void) | null = null
let lastTick = 0

const vinylMotion = (): boolean => useSettingsStore.getState().vinylMotion

export function jogStart(id: DeckId, mode: 'scratch' | 'nudge'): void {
  const deck = getEngine().decks[id]
  if (!deck.isLoaded) return
  const jog = jogs[id]
  if (jog.mode === 'scratch' || jog.mode === 'nudge') jogEnd(id)
  const wasSpinning = jog.mode === 'spin'
  // Står decken stille (eller bremser), er det bare scratch som gir mening.
  jog.mode = deck.isPlaying ? mode : 'scratch'
  jog.pendingTurns = 0
  if (jog.mode === 'scratch') {
    // Tar du tak i en plate som snurrer fritt, er decken allerede i scratch – hånda tar bare over.
    deck.beginScratch()
    jog.target = deck.position
  } else if (wasSpinning) {
    deck.endScratch()
  }
  ensureRunning()
}

/**
 * Platen dreies. Gir false hvis bevegelsen ikke ble brukt (hjulet over en deck som står stille),
 * så dispatch kan flytte posisjonen i stedet.
 */
export function jogMove(id: DeckId, turns: number): boolean {
  const deck = getEngine().decks[id]
  if (!deck.isLoaded) return false
  const jog = jogs[id]
  if (jog.mode === 'scratch') {
    jog.target = Math.min(Math.max(jog.target + turnsToSeconds(turns), 0), deck.duration)
  } else if (jog.mode === 'spin') {
    // Platen snurrer fritt; hjulet gjør ingenting før den har landet.
    return true
  } else if (jog.mode === 'nudge' || deck.isPlaying) {
    jog.pendingTurns += turns
  } else {
    return false
  }
  ensureRunning()
  return true
}

export function jogEnd(id: DeckId): void {
  const jog = jogs[id]
  const deck = getEngine().decks[id]
  jog.pendingTurns = 0
  if (jog.mode === 'scratch') {
    if (vinylMotion() && deck.isScratching) {
      // Platen fortsetter med farten hånda slapp den med, og motoren tar over derfra.
      jog.mode = 'spin'
      jog.speed = clampSpeed(deck.scratchSpeed)
      ensureRunning()
      return
    }
    deck.endScratch()
  }
  if (jog.mode !== 'spin') jog.mode = null
}

/**
 * Play: motoren drar platen opp i fart. Gir false hvis decken skal starte med en gang i stedet
 * (innstillingen er av, eller decken er synket og må treffe slaget nøyaktig).
 */
export function motorStart(id: DeckId, instant: boolean): boolean {
  const deck = getEngine().decks[id]
  const jog = jogs[id]
  if (!deck.isLoaded || deck.isPlaying) return false
  if (instant || !vinylMotion()) {
    haltPlatter(id)
    return false
  }
  if (deck.position >= deck.duration - 0.01) deck.seek(0)
  if (jog.mode === null) {
    deck.beginScratch(0)
    jog.mode = 'spin'
    jog.speed = 0
  }
  // Holder hånda i platen, starter motoren først når du slipper.
  deck.play()
  ensureRunning()
  return true
}

/** Stopp: bremsen tar platen ned. Gir false hvis decken skal stoppe med en gang i stedet. */
export function motorStop(id: DeckId): boolean {
  const deck = getEngine().decks[id]
  const jog = jogs[id]
  if (!deck.isLoaded || !deck.isPlaying || !vinylMotion()) {
    haltPlatter(id)
    return false
  }
  if (jog.mode === 'nudge') jog.mode = null
  if (jog.mode === null) {
    jog.speed = deck.normalRate
    deck.beginScratch(jog.speed)
    jog.mode = 'spin'
  }
  deck.pause()
  ensureRunning()
  return true
}

/**
 * Platen lander med en gang: spiller den, går den i vanlig fart, ellers står den stille.
 * Brukes før cue, hopp og ny låt, så ingen gammel bremsing henger igjen.
 */
export function haltPlatter(id: DeckId): void {
  const jog = jogs[id]
  if (jog.mode !== 'spin') return
  jog.mode = null
  jog.speed = 0
  getEngine().decks[id].endScratch()
}

export function setNudgeButton(id: DeckId, direction: -1 | 0 | 1): void {
  jogs[id].button = direction
  if (direction !== 0) ensureRunning()
}

export function isTouching(id: DeckId): boolean {
  const mode = jogs[id].mode
  return mode === 'scratch' || mode === 'nudge'
}

/** Der platen skal tegnes: under scratch følger den hånda direkte, ellers lyden. */
export function platterPosition(id: DeckId): number {
  const jog = jogs[id]
  return jog.mode === 'scratch' ? jog.target : getEngine().decks[id].position
}

const clampSpeed = (speed: number): number => Math.max(-MAX_SCRATCH_RATE, Math.min(MAX_SCRATCH_RATE, speed))

function ensureRunning(): void {
  if (stopTick) return
  lastTick = performance.now()
  stopTick = onTick(tick)
}

function tick(now: number): void {
  const engine = getEngine()
  const dt = Math.min(Math.max((now - lastTick) / 1000, 0.001), 0.1)
  lastTick = now
  let busy = false
  for (const id of DECK_IDS) {
    const jog = jogs[id]
    const deck = engine.decks[id]
    if (jog.mode === 'spin' && !deck.isScratching) {
      // Decken ble nullstilt (ny låt e.l.) mens platen snurret.
      jog.mode = null
    }
    if (jog.mode === 'scratch') {
      deck.setScratchRate(scratchRate(jog.target, deck.position))
      busy = true
      continue
    }
    const spin = jog.pendingTurns / dt
    jog.pendingTurns = 0
    jog.bend = approach(jog.bend, nudgeFromSpin(spin), dt, BEND_SMOOTHING)
    if (Math.abs(jog.bend) < 1e-4 && spin === 0) jog.bend = 0
    deck.setBend(1 + jog.bend + jog.button * NUDGE_BUTTON)
    if (jog.mode === 'spin') {
      tickSpin(id, dt)
      busy = true
      continue
    }
    if (jog.mode || jog.bend !== 0 || jog.button !== 0) busy = true
  }
  if (!busy && stopTick) {
    stopTick()
    stopTick = null
  }
}

function tickSpin(id: DeckId, dt: number): void {
  const jog = jogs[id]
  const deck = getEngine().decks[id]
  const motorOn = deck.isPlaying
  const target = motorOn ? deck.normalRate : 0
  jog.speed = spinToward(jog.speed, target, dt, motorOn)
  const pos = deck.position
  // Platen kan ikke snurre forbi starten; ved slutten lander den, så låten kan ta slutt som vanlig.
  if (jog.speed < 0 && pos <= 0.005) jog.speed = 0
  const atEnd = jog.speed > 0 && pos >= deck.duration - 0.005
  if (jog.speed === target || atEnd) {
    jog.mode = null
    jog.speed = 0
    deck.endScratch()
    return
  }
  deck.setScratchRate(jog.speed)
}
