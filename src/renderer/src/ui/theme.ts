import { useSyncExternalStore } from 'react'
import type { Settings } from '@shared/settings'
import { useSettingsStore } from '../state/settingsStore'

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

function resolve(theme: Settings['theme']): 'light' | 'dark' {
  return theme === 'light' || (theme === 'system' && !darkQuery.matches) ? 'light' : 'dark'
}

function apply(): void {
  const { theme, accent } = useSettingsStore.getState()
  const root = document.documentElement
  root.dataset.theme = resolve(theme)
  root.dataset.accent = accent
}

/** Setter tema og fargepar på <html>, og følger med når innstillingene (eller macOS) endres. */
export function initTheme(): void {
  apply()
  // Kjøres med en gang settingsStore endres, før React tegner på nytt, så fargene er klare.
  useSettingsStore.subscribe((s, prev) => {
    if (s.theme !== prev.theme || s.accent !== prev.accent) apply()
  })
  darkQuery.addEventListener('change', apply)
}

const subscribeSystem = (listener: () => void): (() => void) => {
  darkQuery.addEventListener('change', listener)
  return () => darkQuery.removeEventListener('change', listener)
}

/** Temaet som faktisk vises nå («system» gjort om til lyst eller mørkt). */
export function useResolvedTheme(): 'light' | 'dark' {
  const theme = useSettingsStore((s) => s.theme)
  const systemDark = useSyncExternalStore(subscribeSystem, () => darkQuery.matches)
  return theme === 'system' ? (systemDark ? 'dark' : 'light') : resolve(theme)
}
