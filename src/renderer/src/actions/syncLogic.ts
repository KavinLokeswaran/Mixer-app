import { getEngine } from '../audio/AudioEngine'
import { alignedPosition, beatsAt, effectiveBpm, matchPitch, TEMPO_RANGE } from '../audio/sync'
import type { DeckId } from '../audio/types'
import { useAppStore, updateDeck } from '../state/store'
import { tr } from '../i18n/tr'

export function otherDeck(id: DeckId): DeckId {
  return id === 'A' ? 'B' : 'A'
}

export function clampPitch(value: number): number {
  return Math.max(-TEMPO_RANGE, Math.min(TEMPO_RANGE, value))
}

/** Setter tempoet på decken, både i lyden og i tilstanden. */
export function applyPitch(id: DeckId, pitch: number): void {
  getEngine().decks[id].setRate(1 + pitch)
  updateDeck(id, { pitch })
}

const noticeTimers: Partial<Record<DeckId, number>> = {}

export function showNotice(id: DeckId, notice: string): void {
  updateDeck(id, { notice })
  window.clearTimeout(noticeTimers[id])
  noticeTimers[id] = window.setTimeout(() => updateDeck(id, { notice: null }), 6000)
}

/** Kan decken synkes til den andre? Gir en forklaring hvis ikke. */
export function syncProblem(id: DeckId): string | null {
  const decks = useAppStore.getState().decks
  const own = decks[id]
  const other = decks[otherDeck(id)]
  if (own.status !== 'ready' || other.status !== 'ready')
    return tr('Synk trenger en låt på begge decks.', 'Sync needs a track on both decks.')
  if (own.analysis === 'running' || other.analysis === 'running')
    return tr('Vent litt – appen finner tempoet.', 'Wait a moment – the app is finding the tempo.')
  if (!own.grid || !other.grid)
    return tr(
      'Appen fant ikke noe tydelig tempo i en av låtene, så de kan ikke synkes.',
      'The app could not find a clear tempo in one of the tracks, so they cannot be synced.'
    )
  return null
}

/** Matcher tempoet til den andre decken. Gir false (og en beskjed) hvis det ikke går. */
export function syncTempo(id: DeckId): boolean {
  const decks = useAppStore.getState().decks
  const own = decks[id]
  const other = decks[otherDeck(id)]
  if (!own.grid || !other.grid) return false
  const match = matchPitch(own.grid.bpm, effectiveBpm(other.grid.bpm, other.pitch))
  if (!match) {
    showNotice(
      id,
      tr(
        'Tempoene er for ulike (mer enn 8 %) til å synkes. Prøv en låt med tempo nærmere den andre.',
        'The tempos are too different (more than 8 %) to sync. Try a track with a tempo closer to the other.'
      )
    )
    return false
  }
  applyPitch(id, match.pitch)
  return true
}

/** Flytter decken litt, så slagene ligger oppå slagene på den andre decken. */
export function syncPhase(id: DeckId): void {
  const engine = getEngine()
  const decks = useAppStore.getState().decks
  const own = decks[id]
  const otherId = otherDeck(id)
  const other = decks[otherId]
  if (!own.grid || !other.grid || !engine.decks[otherId].isPlaying) return
  const match = matchPitch(own.grid.bpm, effectiveBpm(other.grid.bpm, other.pitch))
  if (!match) return
  const otherBeats = beatsAt(engine.decks[otherId].position, other.grid)
  const position = alignedPosition(engine.decks[id].position, own.grid, otherBeats, match.multiplier)
  engine.decks[id].seek(position)
}

/**
 * Den andre decken følger denne (Synk). Starter denne på nytt eller hopper i låten,
 * legges den andre decken tilbake på slagene, så de fortsatt går i takt.
 */
export function realignFollower(id: DeckId): void {
  const follower = otherDeck(id)
  const engine = getEngine()
  if (!useAppStore.getState().decks[follower].synced) return
  if (!engine.decks[id].isPlaying || !engine.decks[follower].isPlaying) return
  syncPhase(follower)
}
