import { describe, expect, it } from 'vitest'
import { SHORTCUTS, shortcutFor, stepKnob, type ShortcutState } from './keymap'

const flat = { trim: 0, eq: { high: 0, mid: 0, low: 0 }, filter: 0 }
const state = (patch: Partial<ShortcutState> = {}): ShortcutState => ({
  crossfader: 0.5,
  decks: { A: flat, B: flat },
  knobStep: 0.1,
  ...patch
})

describe('tastatursnarveier', () => {
  it('har play for begge decks', () => {
    expect(shortcutFor('KeyQ')?.action).toEqual({ type: 'deck/togglePlay', deck: 'A' })
    expect(shortcutFor('KeyP')?.action).toEqual({ type: 'deck/togglePlay', deck: 'B' })
  })

  it('flytter krysslideren med pilene', () => {
    const left = shortcutFor('ArrowLeft')!.action
    expect(typeof left === 'function' && left(state())).toEqual({
      type: 'mixer/setCrossfader',
      value: 0.45
    })
  })

  it('Shift+W/O setter cue der låten er nå', () => {
    expect(shortcutFor('KeyW', true)?.action).toEqual({ type: 'deck/setCueHere', deck: 'A' })
    expect(shortcutFor('KeyO', true)?.action).toEqual({ type: 'deck/setCueHere', deck: 'B' })
    expect(shortcutFor('KeyW')?.action).toEqual({ type: 'deck/cue', deck: 'A' })
  })

  it('bruker vanlig snarvei med Shift når det ikke finnes en egen', () => {
    expect(shortcutFor('KeyQ', true)?.action).toEqual({ type: 'deck/togglePlay', deck: 'A' })
    expect(shortcutFor('KeyZ', true)).toBeNull()
  })

  it('skrur trim og EQ opp og ned med tastaturet', () => {
    const up = shortcutFor('Digit1')!.action
    expect(typeof up === 'function' && up(state())).toEqual({ type: 'deck/setTrim', deck: 'A', value: 0.1 })
    const down = shortcutFor('KeyJ')!.action
    expect(typeof down === 'function' && down(state())).toEqual({
      type: 'deck/setEq',
      deck: 'B',
      band: 'high',
      value: -0.1
    })
    const filter = shortcutFor('Semicolon')!.action
    expect(typeof filter === 'function' && filter(state())).toMatchObject({ type: 'deck/setFilter', deck: 'B' })
  })

  it('stopper i midten og ved endene', () => {
    expect(stepKnob(-0.05, 0.1)).toBe(0)
    expect(stepKnob(0.95, 0.1)).toBe(1)
    expect(stepKnob(-1, -0.1)).toBe(-1)
    expect(stepKnob(0, -0.1)).toBe(-0.1)
  })

  it('har ingen doble taster', () => {
    const codes = SHORTCUTS.map((s) => `${s.shift ? 'shift+' : ''}${s.code}`)
    expect(new Set(codes).size).toBe(codes.length)
  })
})
