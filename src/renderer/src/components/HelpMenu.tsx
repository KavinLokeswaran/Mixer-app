import { useEffect, useRef } from 'react'
import { dispatch } from '../actions/dispatch'
import { groupLabel, groupsUnlockedBy, LESSON_IDS } from '../learn/controlGroups'
import { tourById } from '../learn/tours'
import { useLearnStore } from '../state/learnStore'
import { useSettingsStore } from '../state/settingsStore'
import { tr } from '../i18n/tr'

/** ?-menyen: grunnkurset og leksjonene, med hvilke som er fullført. */
export function HelpMenu(): React.JSX.Element {
  const open = useLearnStore((s) => s.menuOpen)
  const completed = useSettingsStore((s) => s.completedLessons)
  const introDone = useSettingsStore((s) => s.introDone)
  const ref = useRef<HTMLDivElement>(null)
  const intro = tourById('intro')!

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) void dispatch({ type: 'learn/menu', open: false })
    }
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') void dispatch({ type: 'learn/menu', open: false })
    }
    document.addEventListener('pointerdown', close)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="helpmenu" ref={ref}>
      <button
        type="button"
        className="helpmenu__button"
        data-tour-id="help-menu"
        aria-expanded={open}
        aria-label={tr('Hjelp og leksjoner', 'Help and lessons')}
        onClick={() => void dispatch({ type: 'learn/menu', open: !open })}
      >
        ?
      </button>
      {open && (
        <div className="helpmenu__panel" role="menu">
          <div className="helpmenu__heading">{tr('Grunnkurs', 'Basics course')}</div>
          <button
            type="button"
            className="helpmenu__item"
            role="menuitem"
            onClick={() => void dispatch({ type: 'learn/start', tour: 'intro' })}
          >
            <span className={`helpmenu__check ${introDone ? 'helpmenu__check--done' : ''}`}>
              {introDone ? '✓' : '★'}
            </span>
            <span>
              <span className="helpmenu__title">
                {introDone ? tr('Ta grunnkurset på nytt', 'Take the basics course again') : intro.title}
              </span>
              <span className="helpmenu__desc">{intro.description}</span>
            </span>
          </button>
          <div className="helpmenu__heading">{tr('Leksjoner', 'Lessons')}</div>
          {LESSON_IDS.map((id, i) => {
            const lesson = tourById(id)!
            const done = completed.includes(id)
            const unlocks = groupsUnlockedBy(id).map(groupLabel).join(tr(' og ', ' and '))
            return (
              <button
                key={id}
                type="button"
                className="helpmenu__item"
                role="menuitem"
                onClick={() => void dispatch({ type: 'learn/start', tour: id })}
              >
                <span className={`helpmenu__check ${done ? 'helpmenu__check--done' : ''}`}>{done ? '✓' : i + 1}</span>
                <span>
                  <span className="helpmenu__title">{lesson.title}</span>
                  <span className="helpmenu__desc">{lesson.description}</span>
                  <span className="helpmenu__unlocks">
                    {done
                      ? tr(`Låst opp: ${unlocks}`, `Unlocked: ${unlocks}`)
                      : tr(`Låser opp: ${unlocks}`, `Unlocks: ${unlocks}`)}
                  </span>
                </span>
              </button>
            )
          })}
          <button
            type="button"
            className="helpmenu__reset"
            onClick={() => void dispatch({ type: 'ui/settings', open: true })}
          >
            {tr('Tips, beskrivelser og andre innstillinger …', 'Tips, descriptions and other settings …')}
          </button>
        </div>
      )}
    </div>
  )
}
