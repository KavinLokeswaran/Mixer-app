import type { Action } from '../actions/types'
import { beatMultiplier, effectiveBpm, IN_PHASE_BEATS } from '../audio/sync'
import type { DeckId } from '../audio/types'
import type { ControlGroup } from '../learn/controlGroups'
import type { AppState } from '../state/store'
import { formatBpm } from '../util/format'
import { tr } from '../i18n/tr'

/**
 * ALLE SMÅ TIPS
 *
 * Hvert tips har en betingelse som må holde seg sann en liten stund før tipset vises,
 * og en tekst. Hvert tips vises bare én gang (husket mellom gangene).
 */

export interface TipContext {
  app: AppState
  /** Hvor mange slag B ligger foran (+) eller etter (−) A, når begge spiller. */
  phaseOffset: number | null
  clipping: Record<DeckId | 'master', boolean>
  visible: (group: ControlGroup) => boolean
  introDone: boolean
  completedLessons: readonly string[]
  /** Sekunder igjen av låten på hver deck. */
  remaining: Record<DeckId, number>
  /** Sekunder siden appen startet. */
  uptime: number
}

export interface TipRule {
  id: string
  /** Hvor lenge (sekunder) betingelsen må holde før tipset vises. */
  holdSeconds: number
  /** Gir teksten hvis tipset passer nå, ellers null. */
  check: (ctx: TipContext) => string | null
}

const both = (ctx: TipContext): boolean => ctx.app.decks.A.isPlaying && ctx.app.decks.B.isPlaying

/** Tempoforskjell (BPM) mellom B og A slik de spiller nå, tatt hensyn til halvt/dobbelt tempo. */
function tempoDiff(ctx: TipContext): number | null {
  const { A, B } = ctx.app.decks
  if (!A.bpm || !B.bpm) return null
  const effA = effectiveBpm(A.bpm, A.pitch)
  const effB = effectiveBpm(B.bpm, B.pitch)
  return effB - effA * beatMultiplier(effB, effA)
}

export const TIP_RULES: TipRule[] = [
  {
    id: 'clipping',
    holdSeconds: 1,
    check: (ctx) => {
      const deck: DeckId | null = ctx.clipping.A ? 'A' : ctx.clipping.B ? 'B' : null
      if (deck) {
        return ctx.visible('trim')
          ? tr(
              `Du klipper – skru ned trim på deck ${deck}, så lyden ikke blir forvrengt.`,
              `You are clipping – turn the trim down on deck ${deck}, so the sound does not distort.`
            )
          : tr(
              `Lyden på deck ${deck} er så sterk at den klipper. Ta leksjonen «Trim og nivåer» under ?, så lærer du å fikse det.`,
              `The sound on deck ${deck} is so loud that it clips. Take the lesson "Trim and levels" under ? to learn how to fix it.`
            )
      }
      return ctx.clipping.master
        ? tr(
            'Master er for høy – skru ned mastervolumet litt, så lyden ikke blir forvrengt.',
            'The master is too loud – turn the master volume down a little, so the sound does not distort.'
          )
        : null
    }
  },
  {
    id: 'tempo-differs',
    holdSeconds: 4,
    check: (ctx) => {
      const diff = tempoDiff(ctx)
      const { A, B } = ctx.app.decks
      if (!both(ctx) || diff === null || A.synced || B.synced || Math.abs(diff) < 0.5) return null
      return tr(
        `Deck B er ${formatBpm(Math.abs(diff))} BPM ${diff > 0 ? 'raskere' : 'saktere'} enn A – prøv Synk på B.`,
        `Deck B is ${formatBpm(Math.abs(diff))} BPM ${diff > 0 ? 'faster' : 'slower'} than A – try Sync on B.`
      )
    }
  },
  {
    id: 'out-of-phase',
    holdSeconds: 4,
    check: (ctx) => {
      const diff = tempoDiff(ctx)
      if (!both(ctx) || diff === null || Math.abs(diff) >= 0.05 || ctx.phaseOffset === null) return null
      if (Math.abs(ctx.phaseOffset) < IN_PHASE_BEATS * 3) return null
      return tr(
        'Samme tempo, men slagene treffer ikke samtidig (se fasemåleren). Trykk Synk, så legges de oppå hverandre.',
        'Same tempo, but the beats do not land together (see the phase meter). Press Sync to line them up.'
      )
    }
  },
  {
    id: 'both-full',
    holdSeconds: 10,
    check: (ctx) => {
      const { A, B } = ctx.app.decks
      const x = ctx.app.mixer.crossfader
      if (!both(ctx) || A.volume < 0.6 || B.volume < 0.6 || x < 0.3 || x > 0.7) return null
      return tr(
        'Begge låtene spiller fullt – prøv å dra krysslideren mot den låten du vil gå over til.',
        'Both tracks are playing fully – try dragging the crossfader towards the track you want to move to.'
      )
    }
  },
  {
    id: 'bass-clash',
    holdSeconds: 8,
    check: (ctx) => {
      const { A, B } = ctx.app.decks
      const x = ctx.app.mixer.crossfader
      if (!both(ctx) || !ctx.visible('eq') || x < 0.3 || x > 0.7) return null
      if (A.eq.low < -0.3 || B.eq.low < -0.3 || A.volume < 0.5 || B.volume < 0.5) return null
      return tr(
        'To basser samtidig kan låte grøtete. Prøv å skru ned bassen på den ene låten.',
        'Two basslines at once can sound muddy. Try turning the bass down on one of the tracks.'
      )
    }
  },
  {
    id: 'track-ending',
    holdSeconds: 1,
    check: (ctx) => {
      for (const [id, other] of [
        ['A', 'B'],
        ['B', 'A']
      ] as const) {
        const deck = ctx.app.decks[id]
        if (deck.isPlaying && ctx.remaining[id] < 40 && !ctx.app.decks[other].isPlaying) {
          return tr(
            `Låten på deck ${id} er snart ferdig – gjør klar neste låt på deck ${other}.`,
            `The track on deck ${id} is nearly finished – get the next track ready on deck ${other}.`
          )
        }
      }
      return null
    }
  },
  {
    id: 'lessons',
    holdSeconds: 1,
    check: (ctx) =>
      ctx.introDone && ctx.completedLessons.length === 0 && ctx.uptime > 240
        ? tr(
            'Klar for mer? Under ?-knappen øverst finner du små leksjoner som låser opp EQ, loops, effekter og mer.',
            'Ready for more? Under the ? button at the top you will find short lessons that unlock EQ, loops, effects and more.'
          )
        : null
  }
]

/** Tips som utløses av en handling (ikke av tilstand). */
export function tipForAction(action: Action, before: AppState, after: AppState): { id: string; text: string } | null {
  if (action.type === 'deck/setPitch' && before.decks[action.deck].synced && !after.decks[action.deck].synced) {
    return {
      id: 'pitch-ends-sync',
      text: tr(
        `Du flyttet tempo-slideren på deck ${action.deck}, så Synk ble slått av. Trykk Synk igjen hvis du vil ha den på.`,
        `You moved the tempo slider on deck ${action.deck}, so Sync was turned off. Press Sync again if you want it on.`
      )
    }
  }
  return null
}
