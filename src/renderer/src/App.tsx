import { useEffect } from 'react'
import { APP_NAME } from '@shared/appInfo'
import { dispatch } from './actions/dispatch'
import { DeckPanel } from './components/DeckPanel'
import { HelpBubble } from './components/HelpBubble'
import { HelpMenu } from './components/HelpMenu'
import { HelpToggle } from './components/HelpToggle'
import { LibraryPanel } from './components/LibraryPanel'
import { Mixer } from './components/Mixer'
import { ModeSwitch } from './components/ModeSwitch'
import { RecordButton } from './components/RecordButton'
import { SettingsButton, SettingsPage } from './components/SettingsPage'
import { TipBubble } from './components/TipBubble'
import { Toast } from './components/Toast'
import { TourOverlay } from './components/TourOverlay'
import { WaveformRow } from './components/WaveformRow'
import { useSettingsStore } from './state/settingsStore'
import { useKeyboardShortcuts } from './ui/useKeyboardShortcuts'
import { useResolvedTheme } from './ui/theme'

export function App(): React.JSX.Element {
  useKeyboardShortcuts()
  useEffect(() => window.mikseren.onOpenSettings(() => void dispatch({ type: 'ui/settings', open: true })), [])
  const language = useSettingsStore((s) => s.language)
  const accent = useSettingsStore((s) => s.accent)
  const theme = useResolvedTheme()
  // Alt tegnes på nytt når språk eller farger endres: tekstene og bølgeformene leser dem når de tegnes.
  // Tilstanden ligger i storene, så ingenting går tapt.
  return (
    <div className="app" key={`${language}-${theme}-${accent}`} lang={language}>
      <header className="topbar">
        <div className="topbar__name">{APP_NAME}</div>
        <HelpToggle />
        <RecordButton />
        <ModeSwitch />
        <HelpMenu />
        <SettingsButton />
      </header>
      <WaveformRow />
      <main className="stage">
        <DeckPanel id="A" />
        <Mixer />
        <DeckPanel id="B" />
      </main>
      <LibraryPanel />
      <HelpBubble />
      <TourOverlay />
      <TipBubble />
      <Toast />
      <SettingsPage />
    </div>
  )
}
