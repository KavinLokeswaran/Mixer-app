import type { TrackStatus } from '@shared/library'
import { tr } from '../i18n/tr'

/** Vennlige feilmeldinger når en låt ikke kan lastes inn. */
export type LoadProblem = 'not-allowed' | 'not-found' | 'unreadable' | 'undecodable'

export function loadErrorMessage(problem: LoadProblem): string {
  switch (problem) {
    case 'not-found':
      return tr(
        'Fant ikke fila. Kanskje den er flyttet eller slettet?',
        'Could not find the file. Maybe it has been moved or deleted?'
      )
    case 'unreadable':
    case 'not-allowed':
      return tr('Fikk ikke lest fila. Prøv å velge den på nytt.', 'Could not read the file. Try choosing it again.')
    case 'undecodable':
      return tr(
        'Denne fila kan ikke spilles av. Den kan være skadet, eller kopibeskyttet (for eksempel kjøpt eller lastet ned fra Apple Music).',
        'This file cannot be played. It may be damaged, or copy-protected (for example bought or downloaded from Apple Music).'
      )
  }
}

/** Forklaring på hvorfor en låt i biblioteket ble hoppet over. */
export function trackProblemMessage(status: Exclude<TrackStatus, 'ok'>): string {
  switch (status) {
    case 'protected':
      return tr(
        'Kopibeskyttet (for eksempel fra Apple Music). Slike filer kan bare spilles i Apple sin egen app.',
        "Copy-protected (for example from Apple Music). Files like this can only be played in Apple's own app."
      )
    case 'unsupported':
      return tr(
        'Formatet støttes ikke (Apple Lossless). Gjør den om til MP3, AAC, WAV eller FLAC for å bruke den.',
        'The format is not supported (Apple Lossless). Convert it to MP3, AAC, WAV or FLAC to use it.'
      )
    case 'unreadable':
      return tr(
        'Fila ser ut til å være skadet, eller den er ikke en lydfil appen kan lese.',
        'The file seems to be damaged, or it is not an audio file the app can read.'
      )
  }
}

export function folderErrorMessage(reason: 'no-folder' | 'folder-missing'): string {
  return reason === 'folder-missing'
    ? tr(
        'Fant ikke musikkmappa. Er den flyttet, eller er en ekstern disk koblet fra?',
        'Could not find the music folder. Has it been moved, or is an external drive disconnected?'
      )
    : tr('Velg en mappe med musikk for å komme i gang.', 'Choose a folder with music to get started.')
}
