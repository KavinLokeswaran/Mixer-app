/** Språkene appen finnes på. */
export const LANGUAGES = ['nb', 'en'] as const
export type Language = (typeof LANGUAGES)[number]

/** Mørkt, lyst, eller det samme som macOS bruker. */
export const THEMES = ['dark', 'light', 'system'] as const
export type Theme = (typeof THEMES)[number]

/** Fargeparet for deck A og B. */
export const ACCENTS = ['classic', 'neon', 'sunset', 'ocean'] as const
export type Accent = (typeof ACCENTS)[number]

/** Hvor mye én tast skrur trim, EQ og filter. */
export const KEY_STEPS = ['fine', 'normal', 'coarse'] as const
export type KeyStep = (typeof KEY_STEPS)[number]

/** Innstillinger og læringsfremgang som huskes mellom gangene appen brukes. */
export interface Settings {
  /** Avansert modus viser alle kontroller med en gang. */
  advancedMode: boolean
  /** Grunnkurset er fullført eller avsluttet (vises ikke av seg selv igjen). */
  introDone: boolean
  /** ID-ene til leksjonene som er fullført. */
  completedLessons: string[]
  /** Små tips underveis. */
  tipsEnabled: boolean
  /** Tips som allerede er vist, så de ikke mases om. */
  shownTips: string[]
  /** Beskrivelsen som vises når musa holdes over en kontroll. */
  helpBubbles: boolean
  language: Language
  theme: Theme
  accent: Accent
  /** Kan trim, EQ og filter styres med tastaturet? */
  knobKeys: boolean
  keyStep: KeyStep
}

export function defaultSettings(): Settings {
  return {
    advancedMode: false,
    introDone: false,
    completedLessons: [],
    tipsEnabled: true,
    shownTips: [],
    helpBubbles: true,
    language: 'nb',
    theme: 'dark',
    accent: 'classic',
    knobKeys: true,
    keyStep: 'normal'
  }
}

const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string')
const oneOf = <T extends string>(list: readonly T[], v: unknown): v is T =>
  typeof v === 'string' && (list as readonly string[]).includes(v)

/** Godtar bare gyldige felter fra data utenfra. Ukjente felter ignoreres. */
export function parseSettingsPatch(value: unknown): Partial<Settings> | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  const patch: Partial<Settings> = {}
  if (typeof v.advancedMode === 'boolean') patch.advancedMode = v.advancedMode
  if (typeof v.introDone === 'boolean') patch.introDone = v.introDone
  if (typeof v.tipsEnabled === 'boolean') patch.tipsEnabled = v.tipsEnabled
  if (typeof v.helpBubbles === 'boolean') patch.helpBubbles = v.helpBubbles
  if (typeof v.knobKeys === 'boolean') patch.knobKeys = v.knobKeys
  if (isStringArray(v.completedLessons)) patch.completedLessons = [...new Set(v.completedLessons)]
  if (isStringArray(v.shownTips)) patch.shownTips = [...new Set(v.shownTips)]
  if (oneOf(LANGUAGES, v.language)) patch.language = v.language
  if (oneOf(THEMES, v.theme)) patch.theme = v.theme
  if (oneOf(ACCENTS, v.accent)) patch.accent = v.accent
  if (oneOf(KEY_STEPS, v.keyStep)) patch.keyStep = v.keyStep
  return patch
}
