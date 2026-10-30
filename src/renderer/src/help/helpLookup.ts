import { knobKeyLabels, SHORTCUTS, type KnobTarget } from '../actions/keymap'
import type { DeckId } from '../audio/types'
import { language, tr } from '../i18n/tr'
import { useSettingsStore } from '../state/settingsStore'
import { DECK_HELP, GLOBAL_HELP, type HelpText } from './helpTexts'
import { DECK_HELP_EN, GLOBAL_HELP_EN } from './helpTexts.en'
import { parseDeckTourId, type DeckControl, type GlobalControl } from './tourIds'

function playKey(deck: DeckId): string {
  const shortcut = SHORTCUTS.find(
    (s) => typeof s.action === 'object' && s.action.type === 'deck/togglePlay' && s.action.deck === deck
  )
  return shortcut?.label ?? ''
}

function cueKey(deck: DeckId): string {
  const shortcut = SHORTCUTS.find(
    (s) => !s.shift && typeof s.action === 'object' && s.action.type === 'deck/cue' && s.action.deck === deck
  )
  return shortcut?.label ?? ''
}

function fill(text: string, deck: DeckId): string {
  return text.replaceAll('{deck}', deck).replaceAll('{key}', playKey(deck)).replaceAll('{cueKey}', cueKey(deck))
}

const KNOB_CONTROLS: Partial<Record<DeckControl, KnobTarget>> = {
  trim: 'trim',
  'eq-high': 'high',
  'eq-mid': 'mid',
  'eq-low': 'low',
  filter: 'filter'
}

/** «Tastatur: 1 opp, A ned» for knottene som kan styres med tastaturet. */
function knobKeys(deck: DeckId, control: DeckControl): string | undefined {
  const target = KNOB_CONTROLS[control]
  if (!target || !useSettingsStore.getState().knobKeys) return undefined
  const { up, down } = knobKeyLabels(deck, target)
  return tr(`Tastatur: ${up} skrur opp, ${down} skrur ned.`, `Keyboard: ${up} turns it up, ${down} turns it down.`)
}

/** Finner hjelpeteksten for en data-tour-id, på språket som er valgt, eller null. */
export function helpFor(tourId: string): HelpText | null {
  const en = language() === 'en'
  const deckId = parseDeckTourId(tourId)
  if (deckId) {
    const help = (en ? DECK_HELP_EN : DECK_HELP)[deckId.control]
    return {
      title: fill(help.title, deckId.deck),
      what: fill(help.what, deckId.deck),
      when: help.when && fill(help.when, deckId.deck),
      keys: knobKeys(deckId.deck, deckId.control)
    }
  }
  return (en ? GLOBAL_HELP_EN : GLOBAL_HELP)[tourId as GlobalControl] ?? null
}
