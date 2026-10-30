import { appData } from './appData'

/** Velger norsk eller engelsk tekst etter språket i innstillingene. */
export function tr(nb: string, en: string): string {
  return appData().get().settings.language === 'en' ? en : nb
}
