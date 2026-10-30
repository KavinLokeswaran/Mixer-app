import { create } from 'zustand'

/** Tilstand for selve vinduet (ikke lyd eller læring). Endres bare via dispatch(). */
export const useUiStore = create<{ settingsOpen: boolean }>()(() => ({ settingsOpen: false }))
