import { useEffect, useState } from 'react'
import { clippedRecently, startClipMonitor } from '../ui/clipMonitor'
import { onTick } from '../ui/ticker'
import { tr } from '../i18n/tr'

/** Hvor lenge varselet blir stående etter siste klipp. */
const HOLD_MS = 2500

function warningText(): string | null {
  const a = clippedRecently('A', HOLD_MS)
  const b = clippedRecently('B', HOLD_MS)
  if (a && b)
    return tr(
      'Begge kanalene klipper – skru ned trim på A og B.',
      'Both channels are clipping – turn the trim down on A and B.'
    )
  if (a) return tr('Kanal A klipper – skru ned trim på A.', 'Channel A is clipping – turn the trim down on A.')
  if (b) return tr('Kanal B klipper – skru ned trim på B.', 'Channel B is clipping – turn the trim down on B.')
  if (clippedRecently('master', HOLD_MS))
    return tr(
      'Master er for høy – skru ned mastervolumet litt.',
      'The master is too loud – turn the master volume down a little.'
    )
  return null
}

/** Tydelig varsel i mikseren når lyden klipper, med beskjed om hva du kan gjøre. */
export function ClipWarning(): React.JSX.Element {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    startClipMonitor()
    let last: string | null = null
    let frame = 0
    return onTick(() => {
      // Sjekk ca. 10 ganger i sekundet; mer trengs ikke for en tekst.
      if (frame++ % 6 !== 0) return
      const next = warningText()
      if (next !== last) {
        last = next
        setText(next)
      }
    })
  }, [])

  return (
    <div
      className={`clip-warning ${text ? 'clip-warning--on' : ''}`}
      data-tour-id="clip-warning"
      role="status"
      aria-live="polite"
    >
      {text ?? ' '}
    </div>
  )
}
