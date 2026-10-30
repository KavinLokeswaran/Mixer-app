/**
 * GRUNNKURS OG LEKSJONER PÅ ENGELSK
 *
 * Bare tekstene. Stegene, sjekkene og knappene ligger i tours.ts, og tekstene her
 * kobles til dem med tour-ID og steg-ID. Knappetekstene står i samme rekkefølge som knappene.
 */
export interface StepText {
  title: string
  text: string
  waiting?: string
  buttons?: string[]
}

export interface TourText {
  title: string
  description: string
  steps: Record<string, StepText>
}

const SETUP_A: StepText = {
  title: 'Start a track on deck A',
  text: 'For this lesson you need music playing on deck A. Use a track of your own, or press the button below.',
  waiting: 'Waiting for deck A to play …',
  buttons: ['Play practice beat 1 on A']
}

const SETUP_BOTH: StepText = {
  title: 'Start tracks on both decks',
  text: 'For this lesson you need music on both A and B, ideally synced. Use your own tracks, or press the button below.',
  waiting: 'Waiting for both decks to play …',
  buttons: ['Play practice beats on both']
}

export const TOURS_EN: Record<string, TourText> = {
  intro: {
    title: 'Basics course',
    description: 'The most important things, step by step. Takes a couple of minutes.',
    steps: {
      welcome: {
        title: 'Welcome to Mikseren!',
        text: 'Here you will learn to mix two tracks together, the way a DJ does. The course takes a couple of minutes, and you learn by doing it yourself. You can skip steps or stop whenever you like.'
      },
      music: {
        title: 'Choose music',
        text: 'Choose the folder where your music is – or use two practice beats the app has made. The practice beats are great for learning.',
        waiting: 'Choose a folder or the practice beats …',
        buttons: ['Use practice beats', 'Choose music folder …']
      },
      'load-a': {
        title: 'Load a track on deck A',
        text: 'A deck is like a turntable. Drag a track from the library to deck A, or press the A button on a track.',
        waiting: 'Waiting for a track on deck A …',
        buttons: ['Load practice beat 1 on A']
      },
      'play-a': {
        title: 'Play',
        text: 'Press "Play" to start the track on deck A. (Shortcut: Q)',
        waiting: 'Waiting for you to press "Play" …'
      },
      volume: {
        title: 'The volume fader',
        text: 'Each deck has its own volume fader. Drag the volume for A all the way down, then back up. Hear how the track disappears and comes back.',
        waiting: 'Drag the fader down and back up …'
      },
      'start-b': {
        title: 'Get the next track ready on deck B',
        text: 'Load a different track on deck B and press "Play" (shortcut: P). Now both tracks are playing – that is fine. The crossfader decides what you hear.',
        waiting: 'Waiting for deck B to play …',
        buttons: ['Play practice beat 2 on B']
      },
      sync: {
        title: 'BPM, tempo and Sync',
        text: 'BPM means "beats per minute". The tracks have slightly different tempos, so the drums do not land together. Press "Sync" on B: B gets the same tempo as A, and the beats are lined up. Watch the phase meter turn green.',
        waiting: 'Waiting for you to press "Sync" on B …'
      },
      crossfader: {
        title: 'Crossfader: from A to B',
        text: 'Now for the transition itself! Slowly drag the crossfader all the way over to B (right). Feel free to take 10–20 seconds.',
        waiting: 'Drag the crossfader all the way to B …'
      },
      done: {
        title: 'Congratulations, you have done your first transition!',
        text: 'This is what DJs do all night: get the next track ready, get it in time, and blend it in. Under the "?" button at the top you will find short lessons. Each lesson unlocks new controls, such as EQ, loops and effects. Want to see everything at once? Turn on "Advanced mode".'
      }
    }
  },
  'eq-filter': {
    title: 'EQ and filter',
    description: 'Swap the bass between two tracks, and use the filter in a transition.',
    steps: {
      setup: SETUP_BOTH,
      'eq-intro': {
        title: 'EQ: low, mid and high',
        text: 'The EQ knobs turn parts of the sound up and down. When two tracks play at once, the basslines often clash and it gets muddy. That is why DJs swap the bass from one track to the other.'
      },
      'kill-b': {
        title: 'Take the bass out of B',
        text: 'Turn the bass knob on B all the way down (all the way left). Now you only hear the bass from A.',
        waiting: 'Turn the bass on B all the way down …'
      },
      swap: {
        title: 'Swap the bass',
        text: 'Now swap: turn the bass on A all the way down, and the bass on B back up to the middle. Try doing it at the same time, at the end of a bar. Double-clicking puts a knob back in the middle.',
        waiting: 'Bass on A down, bass on B up …'
      },
      filter: {
        title: 'The filter',
        text: 'The filter is one knob with two effects. Turn the filter on A to the right: the bass disappears and the sound gets thin. Then turn it back to the middle (or double-click). The filter is great for fading out a track.',
        waiting: 'Turn the filter on A right, then back …'
      },
      'eq-done': {
        title: 'Well done!',
        text: 'Now you can swap the bass and use the filter. The EQ knobs and the filter are now unlocked in the mixer.'
      }
    }
  },
  'trim-levels': {
    title: 'Trim and levels',
    description: 'Make the tracks equally loud, and avoid clipping.',
    steps: {
      setup: SETUP_A,
      meters: {
        title: 'The level meters',
        text: 'The meter next to the volume fader shows how strong the signal is. Green is good, a little yellow is fine. If the lamp at the top lights red, the sound is "clipping" – it gets distorted.'
      },
      clip: {
        title: 'Try clipping',
        text: 'Turn the trim knob on A all the way up, until the lamp at the top of the meter lights red and the clip warning appears.',
        waiting: 'Turn the trim up until it clips …'
      },
      fix: {
        title: 'Turn it back down',
        text: 'Turn the trim down until the meter stays in the green and yellow, with no red. This is how you set up every new track.',
        waiting: 'Turn the trim down until it stops clipping …'
      },
      'trim-done': {
        title: 'Great!',
        text: 'Use the trim so all your tracks sit at about the same level. Trim is now unlocked in the mixer. And remember: the limiter on the master makes sure the sound never distorts in the speakers.'
      }
    }
  },
  cues: {
    title: 'Cue and hot cues',
    description: 'Set starting points and jump around the track.',
    steps: {
      setup: SETUP_A,
      pause: {
        title: 'Stop the track',
        text: 'Press "Pause" on deck A, and click somewhere in the track overview to find a starting point.',
        waiting: 'Waiting for pause …'
      },
      'set-cue': {
        title: 'Set a cue point',
        text: 'Press "Cue". The starting point is now saved where you are (on the nearest beat).',
        waiting: 'Press "Cue" …'
      },
      'use-cue': {
        title: 'Back to the start',
        text: 'Press "Play", listen for a bit, then press "Cue" again. The track jumps back to the starting point and stops. This is how DJs quickly find the start of the next track.',
        waiting: '"Play", then press "Cue" …'
      },
      hotcue: {
        title: 'Hot cues',
        text: 'Hot cues are shortcuts in the track. Start the track, and press an empty hot cue button to save the spot. Then press the same button again to jump there.',
        waiting: 'Save a hot cue and jump to it …'
      },
      'cues-done': {
        title: 'Super!',
        text: 'Hot cues are remembered for each track, so they are there next time too. Right-click a hot cue to delete it. Hot cues are now unlocked.'
      }
    }
  },
  loops: {
    title: 'Loops',
    description: 'Repeat a part of the track, in time.',
    steps: {
      setup: SETUP_A,
      loop4: {
        title: 'Make a loop',
        text: 'Press 4 to repeat the next four beats over and over. The loop is always in time.',
        waiting: 'Press 4 …'
      },
      shorter: {
        title: 'Make it shorter',
        text: 'Press 1 or 1/2. The loop gets shorter and more intense – great for building tension.',
        waiting: 'Press 1 or 1/2 …'
      },
      exit: {
        title: 'Release the loop',
        text: 'Press "Exit loop", and the track carries on playing as normal.',
        waiting: 'Press "Exit loop" …'
      },
      'loops-done': {
        title: 'Nice!',
        text: 'Loops are handy for stretching a quiet part while you get the next track ready. Loops are now unlocked.'
      }
    }
  },
  fx: {
    title: 'Effects',
    description: 'Echo, reverb and flanger – and a classic "echo out".',
    steps: {
      setup: SETUP_A,
      'echo-on': {
        title: 'Turn on "Echo"',
        text: 'Press "Echo". The sound repeats every half beat, in time with the track.',
        waiting: 'Press "Echo" …'
      },
      'echo-amount': {
        title: 'More echo',
        text: 'Turn the "Amount" knob next to "Echo" up, and the echo gets stronger and lasts longer.',
        waiting: 'Turn the amount up …'
      },
      'echo-out': {
        title: 'Echo out',
        text: 'Press "Pause" on A while "Echo" is on – and hear the echo ring out by itself. This is how many DJs end a track.',
        waiting: 'Press "Pause" with Echo on …'
      },
      others: {
        title: 'Try the others',
        text: 'Turn off "Echo", start the track again, and try "Reverb" (room sound) or "Flanger" (whoosh).',
        waiting: 'Turn on "Reverb" or "Flanger" …'
      },
      'fx-done': {
        title: 'Cool!',
        text: 'Effects are fun, but use them sparingly – a little effect often sounds best. The effects are now unlocked.'
      }
    }
  },
  recording: {
    title: 'Recording your mix',
    description: 'Record what you mix, and save it as an audio file.',
    steps: {
      setup: SETUP_A,
      'start-rec': {
        title: 'Start recording',
        text: 'Press "Record" at the top right. Everything you hear is recorded.',
        waiting: 'Press "Record" …'
      },
      'stop-rec': {
        title: 'Stop and save',
        text: 'Mix for a bit – then press "Stop recording". Choose where to save the file.',
        waiting: 'Press "Stop recording" …'
      },
      'rec-done': {
        title: 'Done!',
        text: 'The recording is an ordinary WAV file you can play anywhere. Recording is now unlocked.'
      }
    }
  }
}
