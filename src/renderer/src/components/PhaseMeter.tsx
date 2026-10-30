import { useEffect, useRef } from 'react'
import { getEngine } from '../audio/AudioEngine'
import { beatMultiplier, beatsAt, effectiveBpm, IN_PHASE_BEATS, phaseOffset } from '../audio/sync'
import { useAppStore } from '../state/store'
import { onTick } from '../ui/ticker'
import { formatBpm } from '../util/format'
import { tr } from '../i18n/tr'

/**
 * Fasemåler: viser om slagene på B treffer samtidig med slagene på A.
 * Nålen i midten = i takt. Til høyre = B ligger foran. Til venstre = B ligger etter.
 */
export function PhaseMeter(): React.JSX.Element {
  const needleRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const tempoRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const engine = getEngine()
    let lastStatus = ''
    let lastTempo = ''
    let lastState = ''
    const setText = (el: HTMLElement | null, text: string, prev: string): string => {
      if (el && text !== prev) el.textContent = text
      return text
    }
    return onTick(() => {
      const { A, B } = useAppStore.getState().decks
      let state = 'idle'
      let status = tr(
        'Viser om slagene treffer samtidig når begge decks spiller.',
        'Shows whether the beats land together when both decks are playing.'
      )
      let tempo = ''
      let needle = 0
      if (A.grid && B.grid) {
        const effA = effectiveBpm(A.grid.bpm, A.pitch)
        const effB = effectiveBpm(B.grid.bpm, B.pitch)
        const m = beatMultiplier(effB, effA)
        const diff = effB - effA * m
        tempo =
          Math.abs(diff) < 0.05
            ? tr('Samme tempo', 'Same tempo')
            : tr(
                `B er ${formatBpm(Math.abs(diff))} BPM ${diff > 0 ? 'raskere' : 'saktere'} enn A`,
                `B is ${formatBpm(Math.abs(diff))} BPM ${diff > 0 ? 'faster' : 'slower'} than A`
              )
        if (engine.decks.A.isPlaying && engine.decks.B.isPlaying) {
          needle = phaseOffset(beatsAt(engine.decks.B.position, B.grid), beatsAt(engine.decks.A.position, A.grid), m)
          const abs = Math.abs(needle)
          state = abs < IN_PHASE_BEATS ? 'ok' : abs < 0.1 ? 'close' : 'off'
          status =
            state === 'ok'
              ? tr('I takt ✓', 'In time ✓')
              : needle > 0
                ? tr('B ligger foran A', 'B is ahead of A')
                : tr('B ligger etter A', 'B is behind A')
        } else {
          status = tr(
            'Start begge decks for å se om de går i takt.',
            'Start both decks to see whether they are in time.'
          )
        }
      } else if (
        A.status === 'ready' &&
        B.status === 'ready' &&
        (A.analysis === 'running' || B.analysis === 'running')
      ) {
        status = tr('Finner tempoet …', 'Finding the tempo …')
      }
      if (needleRef.current) needleRef.current.style.left = `${50 + needle * 100}%`
      if (state !== lastState && rootRef.current) rootRef.current.dataset.state = state
      lastState = state
      lastStatus = setText(statusRef.current, status, lastStatus)
      lastTempo = setText(tempoRef.current, tempo, lastTempo)
    })
  }, [])

  return (
    <div ref={rootRef} className="phase" data-tour-id="phase-meter" data-state="idle">
      <div className="phase__title">{tr('Fasemåler', 'Phase meter')}</div>
      <div className="phase__scale">
        <span className="phase__label">{tr('etter', 'behind')}</span>
        <div className="phase__track">
          <div className="phase__centre" />
          <div ref={needleRef} className="phase__needle" />
        </div>
        <span className="phase__label">{tr('foran', 'ahead')}</span>
      </div>
      <div ref={statusRef} className="phase__status" />
      <div ref={tempoRef} className="phase__tempo" />
    </div>
  )
}
