import { useState } from 'react'
import { dispatch } from '../actions/dispatch'
import { DECK_IDS } from '../audio/types'
import { PRACTICE_BEATS, practiceTitle } from '../practice/arrangement'
import { tr } from '../i18n/tr'

/** Knapp i biblioteket for å laste øvelses-beatene på en deck. */
export function PracticeMenu(): React.JSX.Element {
  const [open, setOpen] = useState(false)
  return (
    <div className="practice">
      <button
        type="button"
        className="button button--small"
        data-tour-id="practice"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {tr('Øvelses-beats', 'Practice beats')} {open ? '▴' : '▾'}
      </button>
      {open && (
        <div className="practice__panel">
          {([1, 2] as const).map((beat) => (
            <div key={beat} className="practice__row">
              <span>
                {practiceTitle(beat)} <span className="practice__bpm">{PRACTICE_BEATS[beat].bpm} BPM</span>
              </span>
              {DECK_IDS.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`tracks__load tracks__load--${d.toLowerCase()}`}
                  aria-label={tr(
                    `Last inn ${practiceTitle(beat)} på deck ${d}`,
                    `Load ${practiceTitle(beat)} on deck ${d}`
                  )}
                  onClick={() => {
                    setOpen(false)
                    void dispatch({ type: 'practice/load', deck: d, beat })
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
