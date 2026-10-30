import type { KeyStep } from '@shared/settings'
import type { EqBand } from '../audio/toneMath'
import type { DeckId } from '../audio/types'
import type { ControlGroup } from '../learn/controlGroups'
import type { Action } from './types'

/** Det en snarvei kan se på når den regner ut handlingen. */
export interface ShortcutState {
  crossfader: number
  decks: Record<DeckId, { trim: number; eq: Record<EqBand, number>; filter: number }>
  /** Hvor langt én tast skrur en knott (av hele området -1 … 1). */
  knobStep: number
}

export interface Shortcut {
  /** KeyboardEvent.code – den fysiske tasten, så det virker likt på alle tastaturoppsett. */
  code: string
  /** Må Shift holdes nede? */
  shift?: boolean
  /** Hva som vises til brukeren. */
  label: string
  action: Action | ((state: ShortcutState) => Action)
  /** Snarveien virker bare når denne kontrollgruppen vises. */
  group?: ControlGroup
  /** Skrur en knott (kan slås av i innstillingene). */
  knob?: boolean
}

/** Knottene som kan skrus med tastaturet, i samme rekkefølge som tastene. */
export type KnobTarget = 'trim' | EqBand | 'filter'
export const KNOB_TARGETS: KnobTarget[] = ['trim', 'high', 'mid', 'low', 'filter']

/**
 * Tallraden skrur opp, raden under skrur ned. Deck A bruker venstre halvdel
 * (1–5 og A–G), deck B høyre halvdel (6–0 og H–Ø).
 */
export const KNOB_KEYS: Record<DeckId, { up: [string, string][]; down: [string, string][] }> = {
  A: {
    up: [
      ['Digit1', '1'],
      ['Digit2', '2'],
      ['Digit3', '3'],
      ['Digit4', '4'],
      ['Digit5', '5']
    ],
    down: [
      ['KeyA', 'A'],
      ['KeyS', 'S'],
      ['KeyD', 'D'],
      ['KeyF', 'F'],
      ['KeyG', 'G']
    ]
  },
  B: {
    up: [
      ['Digit6', '6'],
      ['Digit7', '7'],
      ['Digit8', '8'],
      ['Digit9', '9'],
      ['Digit0', '0']
    ],
    down: [
      ['KeyH', 'H'],
      ['KeyJ', 'J'],
      ['KeyK', 'K'],
      ['KeyL', 'L'],
      ['Semicolon', 'Ø']
    ]
  }
}

export const KEY_STEP_SIZES: Record<KeyStep, number> = { fine: 0.04, normal: 0.1, coarse: 0.2 }

/**
 * Ett tastetrykk på en knott. Går den forbi midten, stopper den i midten,
 * akkurat som hakket når man drar.
 */
export function stepKnob(value: number, delta: number): number {
  const next = Math.max(-1, Math.min(1, value + delta))
  if ((value < 0 && next > 0) || (value > 0 && next < 0)) return 0
  return Math.round(next * 1e4) / 1e4
}

function knobValue(state: ShortcutState, deck: DeckId, target: KnobTarget): number {
  const d = state.decks[deck]
  if (target === 'trim') return d.trim
  if (target === 'filter') return d.filter
  return d.eq[target]
}

function knobAction(deck: DeckId, target: KnobTarget, value: number): Action {
  if (target === 'trim') return { type: 'deck/setTrim', deck, value }
  if (target === 'filter') return { type: 'deck/setFilter', deck, value }
  return { type: 'deck/setEq', deck, band: target, value }
}

const KNOB_GROUP: Record<KnobTarget, ControlGroup> = {
  trim: 'trim',
  high: 'eq',
  mid: 'eq',
  low: 'eq',
  filter: 'filter'
}

function knobShortcuts(): Shortcut[] {
  const list: Shortcut[] = []
  for (const deck of ['A', 'B'] as const) {
    KNOB_TARGETS.forEach((target, i) => {
      for (const dir of ['up', 'down'] as const) {
        const [code, label] = KNOB_KEYS[deck][dir][i]
        const sign = dir === 'up' ? 1 : -1
        list.push({
          code,
          label,
          group: KNOB_GROUP[target],
          knob: true,
          action: (s) => knobAction(deck, target, stepKnob(knobValue(s, deck, target), sign * s.knobStep))
        })
      }
    })
  }
  return list
}

/** Tastatursnarveier. Alle går gjennom dispatch(), akkurat som knappene. */
export const SHORTCUTS: Shortcut[] = [
  { code: 'KeyQ', label: 'Q', action: { type: 'deck/togglePlay', deck: 'A' } },
  { code: 'KeyP', label: 'P', action: { type: 'deck/togglePlay', deck: 'B' } },
  { code: 'KeyW', label: 'W', action: { type: 'deck/cue', deck: 'A' } },
  { code: 'KeyO', label: 'O', action: { type: 'deck/cue', deck: 'B' } },
  { code: 'KeyW', shift: true, label: 'Shift+W', action: { type: 'deck/setCueHere', deck: 'A' } },
  { code: 'KeyO', shift: true, label: 'Shift+O', action: { type: 'deck/setCueHere', deck: 'B' } },
  { code: 'KeyM', label: 'M', action: { type: 'mixer/autoMix' } },
  {
    code: 'ArrowLeft',
    label: '←',
    action: (s) => ({ type: 'mixer/setCrossfader', value: s.crossfader - 0.05 })
  },
  {
    code: 'ArrowRight',
    label: '→',
    action: (s) => ({ type: 'mixer/setCrossfader', value: s.crossfader + 0.05 })
  },
  ...knobShortcuts()
]

/** Tastene for å skru en knott opp og ned, f.eks. til hjelpeboblene. */
export function knobKeyLabels(deck: DeckId, target: KnobTarget): { up: string; down: string } {
  const i = KNOB_TARGETS.indexOf(target)
  return { up: KNOB_KEYS[deck].up[i][1], down: KNOB_KEYS[deck].down[i][1] }
}

/**
 * Finner snarveien for en tast, eller null. Med Shift brukes Shift-snarveien hvis
 * den finnes, ellers den vanlige (så f.eks. Shift+Q fortsatt starter deck A).
 */
export function shortcutFor(code: string, shift = false): Shortcut | null {
  const exact = SHORTCUTS.find((s) => s.code === code && !!s.shift === shift)
  if (exact || !shift) return exact ?? null
  return SHORTCUTS.find((s) => s.code === code && !s.shift) ?? null
}

/** Ikke kapre tastene når brukeren skriver i et felt eller styrer en slider. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || typeof (target as Element).closest !== 'function') return false
  const el = target as HTMLElement
  if (el.isContentEditable) return true
  return el.closest('input, textarea, select') !== null
}
