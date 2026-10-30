import { dispatch } from '../actions/dispatch'
import { tr } from '../i18n/tr'
import { useSettingsStore } from '../state/settingsStore'

/** Slår beskrivelsene (hjelpeboblene) av og på. */
export function HelpToggle(): React.JSX.Element {
  const on = useSettingsStore((s) => s.helpBubbles)
  return (
    <button
      type="button"
      className={`helptoggle ${on ? 'helptoggle--on' : ''}`}
      aria-pressed={on}
      data-help-id="help-toggle"
      onClick={() => void dispatch({ type: 'settings/update', patch: { helpBubbles: !on } })}
    >
      <span className="helptoggle__icon" aria-hidden>
        i
      </span>
      <span className="helptoggle__text">
        {on ? tr('Beskrivelser på', 'Descriptions on') : tr('Beskrivelser av', 'Descriptions off')}
      </span>
      {on && <span className="helptoggle__hint">{tr('Hold musa over en kontroll', 'Hover over a control')}</span>}
    </button>
  )
}
