import type { Language } from '@shared/settings'
import { useSettingsStore } from '../state/settingsStore'

/**
 * SPRÅK
 *
 * Tekst skrives som tr('norsk', 'engelsk') rett der den brukes. Hele grensesnittet
 * tegnes på nytt når språket endres (se App.tsx), så komponentene trenger ikke lytte selv.
 */
export function language(): Language {
  return useSettingsStore.getState().language
}

export function tr(nb: string, en: string): string {
  return language() === 'en' ? en : nb
}

/** Tekst som finnes på begge språk, f.eks. i tabeller med hjelpetekster. */
export interface Translated {
  nb: string
  en: string
}

export function pick(text: Translated): string {
  return text[language()]
}
