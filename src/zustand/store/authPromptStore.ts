import { create } from 'zustand'

interface AuthPromptState {
	open: boolean
	openAuthPrompt: () => void
	closeAuthPrompt: () => void
}

export const useAuthPromptStore = create<AuthPromptState>((set) => ({
	open: false,
	openAuthPrompt: () => set({ open: true }),
	closeAuthPrompt: () => set({ open: false }),
}))
