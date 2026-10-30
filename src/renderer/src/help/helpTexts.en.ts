import type { HelpText } from './helpTexts'
import type { DeckControl, GlobalControl } from './tourIds'

/** Hjelpetekstene på engelsk. Samme nøkler og plassholdere som i helpTexts.ts. */
export const DECK_HELP_EN: Record<DeckControl, HelpText> = {
  panel: {
    title: 'Deck {deck}',
    what: 'A deck is like a turntable. This is where one track plays.',
    when: 'You have two decks, so you can move smoothly from one track to another. Drag a track here from the library to load it.'
  },
  load: {
    title: 'Open file',
    what: 'Choose a track on your computer and put it on deck {deck}.',
    when: 'Use it when the deck is free, or when you want to change tracks.'
  },
  play: {
    title: 'Play / pause',
    what: 'Starts the track, or pauses it.',
    when: 'Start the new track when the previous one is nearing the end. Shortcut: {key}.'
  },
  track: {
    title: 'Track',
    what: 'The name of the track on deck {deck}, and who made it.'
  },
  time: {
    title: 'Time left',
    what: 'How long until the track ends.',
    when: 'Keep an eye on this so you start the next track in time.'
  },
  bpm: {
    title: 'Tempo (BPM)',
    what: 'BPM means "beats per minute" – how fast the track is playing right now. The app works it out by itself.',
    when: 'Tracks with almost the same BPM are the easiest to mix together.'
  },
  position: {
    title: 'Track overview (waveform)',
    what: 'The whole track from start to finish. Tall peaks are loud parts, low ones are quiet. Click to jump there.',
    when: 'Look for quiet parts – that is often the easiest place to start a transition.'
  },
  tempo: {
    title: 'Tempo (pitch)',
    what: 'Makes the track faster (up) or slower (down), by up to 8 %. The pitch changes a little too, like on a turntable.',
    when: 'Use it to get two tracks playing at the same tempo. Double-click to reset.'
  },
  sync: {
    title: 'Sync',
    what: 'Gives deck {deck} the same tempo as the other deck, and lines the beats up on top of each other.',
    when: 'Press it before or while you start the new track. If you move the tempo slider yourself, Sync turns off.'
  },
  waveform: {
    title: 'Waveform',
    what: 'The sound on deck {deck} right around where it is playing now. The line in the middle is "now". The thin vertical lines are the beats.',
    when: 'When the lines for A and B sit straight above each other, the tracks are in time.'
  },
  volume: {
    title: 'Volume (channel fader)',
    what: 'Sets how loud deck {deck} plays.',
    when: 'Push it up to bring a track in, or down to take it out.'
  },
  meter: {
    title: 'Level meter',
    what: 'Shows how strong the signal from deck {deck} is, after trim and EQ but before the volume fader.',
    when: 'Set the trim so it sits in the green and sometimes in the yellow. If the lamp at the top lights red, it is clipping – turn the trim down.'
  },
  trim: {
    title: 'Trim (gain)',
    what: 'Adjusts how strongly the track comes into the mixer. Some tracks are mastered louder than others.',
    when: 'Use it so both tracks sit at about the same level on the meters. Double-click to reset.'
  },
  'eq-high': {
    title: 'High (treble)',
    what: 'Turns the bright sounds up or down: hi-hats, cymbals and "air".',
    when: 'Turn it down a little if things get harsh with two tracks playing at once. Double-click to reset.'
  },
  'eq-mid': {
    title: 'Mid',
    what: 'Turns the middle of the sound up or down: vocals, synths and guitar.',
    when: 'Turn it down to make room for the vocals in the other track. Double-click to reset.'
  },
  'eq-low': {
    title: 'Low (bass)',
    what: 'Turns the bass and kick up or down. All the way down removes almost all the bass ("kill").',
    when: 'In a transition: take the bass right out of one track, so the two basslines do not clash. Double-click to reset.'
  },
  cue: {
    title: 'Cue',
    what: 'A starting point in the track. When the track is stopped, Cue sets the starting point where you are. When it is playing, Cue jumps back to the starting point and stops.',
    when: 'Find a good place to start (e.g. the first beat), press Cue, then press Play when you want the track to start. Shortcut: {cueKey}. Hold Shift (Shift+{cueKey} or Shift-click) to set the cue exactly where the track is now, without stopping it.'
  },
  tabs: {
    title: 'More tools',
    what: 'Switch between hot cues, loops and effects for deck {deck}.'
  },
  hotcues: {
    title: 'Hot cues',
    what: 'Four shortcuts to places in the track. An empty button saves where you are now. A full button jumps there.',
    when: 'Save the chorus or a break, for example, so you can jump there any time. Right-click (or Shift-click) to delete. Hot cues are remembered for next time.'
  },
  loops: {
    title: 'Loops',
    what: 'Plays the same part over and over, in time. The number is how many beats the loop is.',
    when: 'Handy for stretching a quiet part while you get the next track ready. Press another number to change the length.'
  },
  'loop-exit': {
    title: 'Exit loop',
    what: 'Releases the loop, so the track carries on playing as normal.'
  },
  fx: {
    title: 'Effects',
    what: 'Three effects you can put on deck {deck}. Turn them on and off, and choose how much with the knob.',
    when: 'Use them sparingly – a little effect in a transition often sounds best.'
  },
  'fx-echo': {
    title: 'Echo (delay)',
    what: 'Repeats the sound every half beat, in time with the track. When you turn it off, the echo fades out by itself.',
    when: 'A classic way to end a track: turn on Echo and pull the volume down.'
  },
  'fx-reverb': {
    title: 'Reverb',
    what: 'Makes the sound seem as if it is playing in a big room.',
    when: 'Good for softening a transition, or on a quiet part.'
  },
  'fx-flanger': {
    title: 'Flanger',
    what: 'A swirling "jet plane" sound that slowly sweeps up and down.',
    when: 'Often used in build-ups before a drop.'
  },
  filter: {
    title: 'Filter',
    what: 'One knob with two filters. To the left the sound becomes dark and muffled (low-pass). To the right it becomes thin, without bass (high-pass). In the middle the filter is off.',
    when: 'Good for "fading out" a track in a transition, or for building tension. Double-click to turn it off.'
  },
  platter: {
    title: 'Platter (jog wheel)',
    what: 'The platter spins when deck {deck} is playing. Drag on top of the platter to scratch – the track follows your hand, even backwards. Drag the edge to push the track a little faster or slower.',
    when: 'Use the edge (or two fingers on the trackpad) to line the beats up with the other track. The ring around it shows how far the track has got, and flashes when there are under 30 seconds left.'
  },
  nudge: {
    title: 'Nudge',
    what: 'Hold ›› to make deck {deck} a little faster for a moment, or ‹‹ for a little slower. The tempo goes back when you let go.',
    when: 'Beats drifting slightly out of time? Give the new track a little nudge until the lines sit on top of each other.'
  }
}

export const GLOBAL_HELP_EN: Record<GlobalControl, HelpText> = {
  crossfader: {
    title: 'Crossfader',
    what: 'Blends between deck A (left) and deck B (right). In the middle you hear both.',
    when: 'Drag it slowly from one side to the other to move over to the next track. Shortcut: ← and →. Double-click to centre it.'
  },
  'master-volume': {
    title: 'Master volume',
    what: 'The overall volume of the whole mix.',
    when: 'Set it so the meter stays out of the red.'
  },
  'master-meter': {
    title: 'Master level',
    what: 'Shows how loud the whole mix is.',
    when: 'If it lights red, the sound is clipping. Turn the volume down a little.'
  },
  'help-menu': {
    title: 'Help and lessons',
    what: 'Here you will find the basics course and short lessons. Each lesson unlocks new controls.',
    when: 'Take a lesson when you are ready for something new.'
  },
  'mode-switch': {
    title: 'Advanced mode',
    what: 'Simple mode shows only the essentials. Advanced mode shows every control right away.',
    when: 'Turn it on if you want to explore everything yourself, without taking the lessons first.'
  },
  practice: {
    title: 'Practice beats',
    what: 'Two simple tracks the app makes by itself (120 and 124 BPM), with drums and bass.',
    when: 'Great for practising and for the lessons, even if you have no music of your own.'
  },
  record: {
    title: 'Record',
    what: 'Records everything you hear – the whole mix – to an audio file (WAV).',
    when: 'Press to start. Press again to stop, then choose where to save the file.'
  },
  limiter: {
    title: 'Limiter',
    what: 'An automatic safety on the master that tames the loudest peaks, so the sound never distorts in the speakers.',
    when: 'If the lamp lights up often, you are playing too loud. Turn the trim or master volume down a little.'
  },
  'clip-warning': {
    title: 'Clip warning',
    what: 'Appears when the sound is so loud that it distorts ("clips").',
    when: 'Do what the warning says, and it will go away.'
  },
  'phase-meter': {
    title: 'Phase meter',
    what: 'Shows whether the beats in the two tracks hit at the same time. Green in the middle means in time.',
    when: 'If it leans to one side, one track is slightly ahead of the other. Press Sync to fix it.'
  },
  library: {
    title: 'Music library',
    what: 'All the tracks in your music folder.',
    when: 'Drag a track to a deck, or use the A and B buttons on each row.'
  },
  'library-folder': {
    title: 'Choose music folder',
    what: 'Choose the folder where your music is. The app looks in all subfolders too.',
    when: 'Do this the first time, or when you want to use a different folder.'
  },
  'library-rescan': {
    title: 'Rescan',
    what: 'Looks for new, changed or deleted tracks in the folder.',
    when: 'Use it after adding new music. It also happens by itself when the app starts.'
  },
  'library-status': {
    title: 'Status',
    what: 'Shows how many tracks you have, and what the app is doing.'
  },
  'library-search': {
    title: 'Search',
    what: 'Type part of the title or artist name to find a track.',
    when: 'You can type several words, e.g. "house remix".'
  },
  'library-sort': {
    title: 'Sorting',
    what: 'Click a column to sort by it. Click again to reverse the order.',
    when: 'Sort by BPM to find tracks that match in tempo.'
  },
  'library-list': {
    title: 'Track list',
    what: 'Title, artist, length and tempo (BPM) for each track.',
    when: 'Drag a row over to deck A or B to load it.'
  },
  'library-load-a': {
    title: 'Load on A',
    what: 'Puts the track on deck A (left).'
  },
  'library-load-b': {
    title: 'Load on B',
    what: 'Puts the track on deck B (right).'
  },
  'library-skipped': {
    title: 'Skipped',
    what: 'Files the app cannot play, such as copy-protected Apple Music files or damaged files.',
    when: 'Click to see which files and why.'
  },
  'auto-mix': {
    title: 'Auto transition',
    what: 'The app mixes over to the other deck for you: it starts the track (in time, if it can), moves the crossfader smoothly and swaps the bass halfway.',
    when: 'Choose how many beats the transition should take. Press again, or grab the crossfader, to cancel. Shortcut: M.'
  },
  'crossfader-curve': {
    title: 'Crossfader curve',
    what: 'Smooth: the sound glides evenly from one track to the other. Sharp: both play fully, and one is cut completely only at the very edge.',
    when: 'Smooth suits ordinary transitions. Sharp suits scratching and quick cuts.'
  },
  'help-toggle': {
    title: 'Descriptions',
    what: 'Turns these explanations on and off – the ones that pop up when you hover over a control.',
    when: 'Turn them off once you know the app well and no longer need help.'
  },
  settings: {
    title: 'Settings',
    what: 'Choose the theme, colour scheme and language, and decide how help and the keyboard should work.',
    when: 'Shortcut: ⌘ ,'
  }
}
