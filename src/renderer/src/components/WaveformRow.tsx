import { PhaseMeter } from './PhaseMeter'
import { ZoomedWaveform } from './ZoomedWaveform'
import { tr } from '../i18n/tr'

/** De to rullende bølgeformene stablet over hverandre, med fasemåleren ved siden av. */
export function WaveformRow(): React.JSX.Element {
  return (
    <section className="waves" aria-label={tr('Bølgeformer', 'Waveforms')}>
      <div className="waves__stack">
        <ZoomedWaveform id="A" />
        <ZoomedWaveform id="B" />
      </div>
      <PhaseMeter />
    </section>
  )
}
