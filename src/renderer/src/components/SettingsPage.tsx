import { useEffect, useRef } from 'react'
import type { Accent, KeyStep, Language, Theme } from '@shared/settings'
import { dispatch } from '../actions/dispatch'
import { KNOB_KEYS, KNOB_TARGETS, type KnobTarget } from '../actions/keymap'
import type { Action } from '../actions/types'
import { tr } from '../i18n/tr'
import { useSettingsStore } from '../state/settingsStore'
import { useUiStore } from '../state/uiStore'

/** Tannhjulet øverst til høyre. */
export function SettingsButton(): React.JSX.Element {
  return (
    <button
      type="button"
      className="settings-button"
      aria-label={tr('Innstillinger', 'Settings')}
      data-help-id="settings"
      onClick={() => void dispatch({ type: 'ui/settings', open: true })}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7.6 7.6 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.6 7.6 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.6 7.6 0 0 0 1.7-1l2.5 1 2-3.5zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
          transform="translate(-1 0)"
        />
      </svg>
    </button>
  )
}

/** Fargene i hvert fargepar, for forhåndsvisningen. Samme som i styles.css. */
const ACCENT_PREVIEW: Record<Accent, [string, string]> = {
  classic: ['#3d8bff', '#ff8a2b'],
  neon: ['#a970ff', '#2fd6a0'],
  sunset: ['#ff5fa2', '#ffb020'],
  ocean: ['#22bfe6', '#7b8cff']
}

function accentName(accent: Accent): string {
  switch (accent) {
    case 'classic':
      return tr('Klassisk', 'Classic')
    case 'neon':
      return 'Neon'
    case 'sunset':
      return tr('Solnedgang', 'Sunset')
    case 'ocean':
      return tr('Hav', 'Ocean')
  }
}

function knobName(target: KnobTarget): string {
  switch (target) {
    case 'trim':
      return 'Trim'
    case 'high':
      return tr('Diskant', 'High')
    case 'mid':
      return tr('Mellomtone', 'Mid')
    case 'low':
      return tr('Bass', 'Low')
    case 'filter':
      return 'Filter'
  }
}

/** Knapper der bare ett valg kan være på, som i resten av appen. */
function Segmented<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}): React.JSX.Element {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={`segmented__option ${value === o.value ? 'segmented__option--on' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Row({
  title,
  desc,
  children
}: {
  title: string
  desc?: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="settings__row">
      <div className="settings__row-text">
        <div className="settings__row-title">{title}</div>
        {desc && <div className="settings__row-desc">{desc}</div>}
      </div>
      <div className="settings__row-control">{children}</div>
    </div>
  )
}

function Switch({
  checked,
  label,
  onChange
}: {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}): React.JSX.Element {
  return (
    <label className="mode settings__switch">
      <input
        type="checkbox"
        role="switch"
        className="mode__input"
        checked={checked}
        aria-label={label}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      <span className="mode__track" aria-hidden>
        <span className="mode__thumb" />
      </span>
    </label>
  )
}

/** Innstillingssiden: utseende, språk, hjelp og tastatur. */
export function SettingsPage(): React.JSX.Element | null {
  const open = useUiStore((s) => s.settingsOpen)
  const s = useSettingsStore()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') void dispatch({ type: 'ui/settings', open: false })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null
  const close = (): void => void dispatch({ type: 'ui/settings', open: false })
  const set = (patch: Extract<Action, { type: 'settings/update' }>['patch']): void =>
    void dispatch({ type: 'settings/update', patch })

  return (
    <div
      className="settings"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="settings__card" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <header className="settings__header">
          <h2 id="settings-title" className="settings__title">
            {tr('Innstillinger', 'Settings')}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="settings__close"
            aria-label={tr('Lukk', 'Close')}
            onClick={close}
          >
            ×
          </button>
        </header>

        <div className="settings__body">
          <section className="settings__section">
            <h3 className="settings__heading">{tr('Utseende', 'Appearance')}</h3>
            <Row title={tr('Tema', 'Theme')}>
              <Segmented<Theme>
                label={tr('Tema', 'Theme')}
                value={s.theme}
                options={[
                  { value: 'dark', label: tr('Mørkt', 'Dark') },
                  { value: 'light', label: tr('Lyst', 'Light') },
                  { value: 'system', label: tr('Som macOS', 'Like macOS') }
                ]}
                onChange={(theme) => set({ theme })}
              />
            </Row>
            <Row
              title={tr('Fargetone', 'Colour scheme')}
              desc={tr('Fargene til deck A og B.', 'The colours of deck A and B.')}
            >
              <div className="settings__accents" role="radiogroup" aria-label={tr('Fargetone', 'Colour scheme')}>
                {(Object.keys(ACCENT_PREVIEW) as Accent[]).map((accent) => (
                  <button
                    key={accent}
                    type="button"
                    role="radio"
                    aria-checked={s.accent === accent}
                    className={`settings__accent ${s.accent === accent ? 'settings__accent--on' : ''}`}
                    onClick={() => set({ accent })}
                  >
                    <span className="settings__swatch" aria-hidden>
                      <span style={{ background: ACCENT_PREVIEW[accent][0] }}>A</span>
                      <span style={{ background: ACCENT_PREVIEW[accent][1] }}>B</span>
                    </span>
                    <span className="settings__accent-name">{accentName(accent)}</span>
                  </button>
                ))}
              </div>
            </Row>
          </section>

          <section className="settings__section">
            <h3 className="settings__heading">{tr('Språk', 'Language')}</h3>
            <Row title={tr('Språk i appen', 'App language')}>
              <Segmented<Language>
                label={tr('Språk', 'Language')}
                value={s.language}
                options={[
                  { value: 'nb', label: 'Norsk' },
                  { value: 'en', label: 'English' }
                ]}
                onChange={(language) => set({ language })}
              />
            </Row>
          </section>

          <section className="settings__section">
            <h3 className="settings__heading">{tr('Hjelp og læring', 'Help and learning')}</h3>
            <Row
              title={tr('Beskrivelser', 'Descriptions')}
              desc={tr(
                'Vis en kort forklaring når du holder musa over en kontroll.',
                'Show a short explanation when you hover over a control.'
              )}
            >
              <Switch
                checked={s.helpBubbles}
                label={tr('Beskrivelser', 'Descriptions')}
                onChange={(helpBubbles) => set({ helpBubbles })}
              />
            </Row>
            <Row
              title={tr('Små tips underveis', 'Tips along the way')}
              desc={tr(
                'Råd når appen ser noe du kan gjøre bedre.',
                'Advice when the app notices something you could improve.'
              )}
            >
              <div className="settings__inline">
                <button
                  type="button"
                  className="button button--small"
                  onClick={() => void dispatch({ type: 'settings/resetTips' })}
                >
                  {tr('Vis tipsene på nytt', 'Show tips again')}
                </button>
                <Switch
                  checked={s.tipsEnabled}
                  label={tr('Små tips underveis', 'Tips along the way')}
                  onChange={(value) => void dispatch({ type: 'settings/setTips', value })}
                />
              </div>
            </Row>
            <Row
              title={tr('Avansert modus', 'Advanced mode')}
              desc={tr(
                'Vis alle kontroller med en gang, uten å ta leksjonene først.',
                'Show every control right away, without taking the lessons first.'
              )}
            >
              <Switch
                checked={s.advancedMode}
                label={tr('Avansert modus', 'Advanced mode')}
                onChange={(value) => void dispatch({ type: 'settings/setAdvanced', value })}
              />
            </Row>
          </section>

          <section className="settings__section">
            <h3 className="settings__heading">{tr('Tastatur', 'Keyboard')}</h3>
            <Row
              title={tr('Styr knottene med tastaturet', 'Control the knobs with the keyboard')}
              desc={tr(
                'Trim, diskant, mellomtone, bass og filter. Hold Shift for små steg.',
                'Trim, high, mid, low and filter. Hold Shift for small steps.'
              )}
            >
              <Switch
                checked={s.knobKeys}
                label={tr('Styr knottene med tastaturet', 'Control the knobs with the keyboard')}
                onChange={(knobKeys) => set({ knobKeys })}
              />
            </Row>
            <Row title={tr('Hvor mye per tastetrykk', 'How much per key press')}>
              <Segmented<KeyStep>
                label={tr('Hvor mye per tastetrykk', 'How much per key press')}
                value={s.keyStep}
                options={[
                  { value: 'fine', label: tr('Lite', 'Small') },
                  { value: 'normal', label: tr('Middels', 'Medium') },
                  { value: 'coarse', label: tr('Mye', 'Large') }
                ]}
                onChange={(keyStep) => set({ keyStep })}
              />
            </Row>
            <KeyTable dimmed={!s.knobKeys} />
            <div className="settings__keys-other">
              <span>
                <kbd>Q</kbd> / <kbd>P</kbd> {tr('spill av A / B', 'play A / B')}
              </span>
              <span>
                <kbd>W</kbd> / <kbd>O</kbd> Cue A / B
              </span>
              <span>
                <kbd>←</kbd> <kbd>→</kbd> {tr('krysslider', 'crossfader')}
              </span>
              <span>
                <kbd>M</kbd> {tr('auto-overgang', 'auto transition')}
              </span>
              <span>
                <kbd>⌘</kbd> <kbd>,</kbd> {tr('innstillinger', 'settings')}
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

/** Oversikt over tastene for knottene: opp på tallraden, ned på raden under. */
function KeyTable({ dimmed }: { dimmed: boolean }): React.JSX.Element {
  return (
    <table className={`settings__keys ${dimmed ? 'settings__keys--off' : ''}`}>
      <thead>
        <tr>
          <th />
          <th className="settings__keys-deck settings__keys-deck--a" colSpan={2}>
            Deck A
          </th>
          <th className="settings__keys-deck settings__keys-deck--b" colSpan={2}>
            Deck B
          </th>
        </tr>
        <tr>
          <th />
          <th>{tr('Opp', 'Up')}</th>
          <th>{tr('Ned', 'Down')}</th>
          <th>{tr('Opp', 'Up')}</th>
          <th>{tr('Ned', 'Down')}</th>
        </tr>
      </thead>
      <tbody>
        {KNOB_TARGETS.map((target, i) => (
          <tr key={target}>
            <th scope="row">{knobName(target)}</th>
            <td>
              <kbd>{KNOB_KEYS.A.up[i][1]}</kbd>
            </td>
            <td>
              <kbd>{KNOB_KEYS.A.down[i][1]}</kbd>
            </td>
            <td>
              <kbd>{KNOB_KEYS.B.up[i][1]}</kbd>
            </td>
            <td>
              <kbd>{KNOB_KEYS.B.down[i][1]}</kbd>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
