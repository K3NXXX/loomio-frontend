import { create } from 'zustand'
import type { IChannel } from '@/types/channel.types'

interface ChannelStore {
	channel: IChannel | null
	isLoading: boolean
	setChannel: (channel: IChannel | null) => void
	setLoading: (value: boolean) => void
	resetChannel: () => void
}

export const useChannelStore = create<ChannelStore>((set) => ({
	channel: null,
	isLoading: false,

	setChannel: (channel) => set({ channel }),
	setLoading: (value) => set({ isLoading: value }),
	resetChannel: () => set({ channel: null, isLoading: false }),
}))
