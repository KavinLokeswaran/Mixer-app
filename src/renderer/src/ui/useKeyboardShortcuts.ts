import { useEffect } from 'react'
import { dispatch } from '../actions/dispatch'
import { isTypingTarget, KEY_STEP_SIZES, shortcutFor } from '../actions/keymap'
import { isGroupVisible } from '../learn/controlGroups'
import { useLearnStore } from '../state/learnStore'
import { useSettingsStore } from '../state/settingsStore'
import { useAppStore } from '../state/store'
import { useUiStore } from '../state/uiStore'

export function useKeyboardShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return
      if (useUiStore.getState().settingsOpen) return
      const shortcut = shortcutFor(event.code, event.shiftKey)
      if (!shortcut) return
      // Play-knappene skal ikke slå av og på hvis tasten holdes nede.
      if (event.repeat && typeof shortcut.action === 'object') return
      const settings = useSettingsStore.getState()
      if (shortcut.knob && !settings.knobKeys) return
      if (shortcut.group) {
        const active = useLearnStore.getState().active
        const activeLesson = active && active.tourId !== 'intro' ? active.tourId : null
        if (!isGroupVisible(shortcut.group, { ...settings, activeLesson })) return
      }
      event.preventDefault()
      const app = useAppStore.getState()
      // Shift gir finjustering, akkurat som når man drar i knotten.
      const step = KEY_STEP_SIZES[settings.keyStep] * (event.shiftKey ? 0.25 : 1)
      const action =
        typeof shortcut.action === 'function'
          ? shortcut.action({ crossfader: app.mixer.crossfader, decks: app.decks, knobStep: step })
          : shortcut.action
      void dispatch(action)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
