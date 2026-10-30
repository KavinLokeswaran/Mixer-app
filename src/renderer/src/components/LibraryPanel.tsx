import { useMemo, useState } from 'react'
import type { TrackInfo } from '@shared/library'
import { dispatch } from '../actions/dispatch'
import { trackProblemMessage } from '../actions/messages'
import { visibleTracks } from '../library/filterSort'
import { useLibraryStore } from '../state/libraryStore'
import { lastPathPart } from '../util/path'
import { PracticeMenu } from './PracticeMenu'
import { TrackList } from './TrackList'
import { tr } from '../i18n/tr'

export function LibraryPanel(): React.JSX.Element {
  const { ready, folder, tracks, analysis, analysisProgress, progress, folderError, search, sort } = useLibraryStore()
  const visible = useMemo(() => visibleTracks(tracks, search, sort, analysis), [tracks, search, sort, analysis])
  const skipped = useMemo(() => tracks.filter((t) => t.status !== 'ok'), [tracks])
  const playable = tracks.length - skipped.length
  const scanning = progress.phase !== 'idle'
  const [showSkipped, setShowSkipped] = useState(false)

  return (
    <section
      className="library"
      data-tour-id="library"
      data-no-help
      aria-label={tr('Musikkbibliotek', 'Music library')}
    >
      <header className="library__header">
        <h2 className="library__title" data-help-id="library">
          {tr('Musikkbibliotek', 'Music library')}
        </h2>
        {folder && (
          <span className="library__folder" title={folder}>
            {lastPathPart(folder)}
          </span>
        )}
        <button
          type="button"
          className="button button--small"
          data-tour-id="library-folder"
          onClick={() => void dispatch({ type: 'library/pickFolder' })}
          disabled={scanning}
        >
          {folder ? tr('Bytt mappe …', 'Change folder …') : tr('Velg mappe …', 'Choose folder …')}
        </button>
        {folder && (
          <button
            type="button"
            className="button button--small"
            data-tour-id="library-rescan"
            onClick={() => void dispatch({ type: 'library/rescan' })}
            disabled={scanning}
          >
            {tr('Skann på nytt', 'Rescan')}
          </button>
        )}
        <span
          className={`library__status ${scanning ? 'library__status--busy' : ''}`}
          data-tour-id="library-status"
          role="status"
        >
          {statusText(progress, playable)}
        </span>
        {!scanning && analysisProgress && (
          <span className="library__status library__status--busy" data-help-id="library-status">
            {tr(
              `Analyserer ${analysisProgress.done + 1} av ${analysisProgress.total}`,
              `Analysing ${analysisProgress.done + 1} of ${analysisProgress.total}`
            )}
          </span>
        )}
        {skipped.length > 0 && (
          <button
            type="button"
            className="library__skipped-toggle"
            data-tour-id="library-skipped"
            aria-expanded={showSkipped}
            onClick={() => setShowSkipped((v) => !v)}
          >
            {skipped.length === 1
              ? tr('1 fil hoppet over', '1 file skipped')
              : tr(`${skipped.length} filer hoppet over`, `${skipped.length} files skipped`)}{' '}
            {showSkipped ? '▴' : '▾'}
          </button>
        )}
        <PracticeMenu />
        <input
          type="search"
          className="library__search"
          placeholder={tr('Søk etter tittel eller artist', 'Search by title or artist')}
          aria-label={tr('Søk i biblioteket', 'Search the library')}
          data-tour-id="library-search"
          value={search}
          onChange={(e) => void dispatch({ type: 'library/setSearch', query: e.currentTarget.value })}
          disabled={!folder}
        />
      </header>

      {folderError && <div className="library__notice library__notice--error">{folderError}</div>}

      {showSkipped && skipped.length > 0 && <SkippedList tracks={skipped} />}

      {!ready ? null : !folder ? (
        <EmptyLibrary />
      ) : tracks.length === 0 && !scanning ? (
        <div className="library__empty">
          {tr(
            'Fant ingen lydfiler i denne mappa. Appen leter etter MP3, WAV, FLAC og M4A/AAC.',
            'Found no audio files in this folder. The app looks for MP3, WAV, FLAC and M4A/AAC.'
          )}
        </div>
      ) : (
        <TrackList
          tracks={visible}
          sort={sort}
          emptyText={
            search
              ? tr('Ingen låter passer til søket.', 'No tracks match the search.')
              : tr('Leter etter musikk …', 'Looking for music …')
          }
        />
      )}
    </section>
  )
}

function statusText(progress: ReturnType<typeof useLibraryStore.getState>['progress'], playable: number): string {
  switch (progress.phase) {
    case 'finding':
      return tr(`Leter etter musikk … fant ${progress.found}`, `Looking for music … found ${progress.found}`)
    case 'reading':
      return tr(
        `Leser låtinfo ${progress.done} av ${progress.total}`,
        `Reading track info ${progress.done} of ${progress.total}`
      )
    case 'idle':
      return playable === 1 ? tr('1 låt', '1 track') : tr(`${playable} låter`, `${playable} tracks`)
  }
}

function EmptyLibrary(): React.JSX.Element {
  return (
    <div className="library__welcome">
      <p className="library__welcome-title">{tr('Hvor ligger musikken din?', 'Where is your music?')}</p>
      <p>
        {tr(
          'Velg mappa med musikkfilene dine (MP3, WAV, FLAC eller M4A). Appen finner låtene, også i undermapper.',
          'Choose the folder with your music files (MP3, WAV, FLAC or M4A). The app finds the tracks, in subfolders too.'
        )}
      </p>
      <button
        type="button"
        className="button button--primary"
        onClick={() => void dispatch({ type: 'library/pickFolder' })}
      >
        {tr('Velg musikkmappe …', 'Choose music folder …')}
      </button>
      <p className="library__welcome-alt">
        {tr(
          'Ingen musikk for hånden? Bruk «Øvelses-beats» oppe til høyre – to låter appen lager selv.',
          'No music to hand? Use "Practice beats" at the top right – two tracks the app makes by itself.'
        )}
      </p>
    </div>
  )
}

function SkippedList({ tracks }: { tracks: TrackInfo[] }): React.JSX.Element {
  return (
    <div className="library__skipped">
      <p className="library__skipped-intro">
        {tr(
          'Disse filene kan ikke spilles av, så de vises ikke i listen:',
          'These files cannot be played, so they are not shown in the list:'
        )}
      </p>
      <ul>
        {tracks.map((t) => (
          <li key={t.id}>
            <span className="library__skipped-name" title={t.path}>
              {t.fileName}.{t.ext}
            </span>
            <span className="library__skipped-why">{t.status !== 'ok' && trackProblemMessage(t.status)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
