import type { WatchMiniSnapshot } from '@/lib/watch-mini-player-snapshot'
import { watchMiniSnapshotRef } from '@/lib/watch-mini-player-snapshot'
import { create } from 'zustand'

export type MiniPlayerActive = Omit<WatchMiniSnapshot, 'paused' | 'currentTime'> & {
	startTime: number
	/** Чи показувати міні-плеєр на паузі (як на сторінці перегляду). */
	startPaused: boolean
}

interface MiniPlayerState {
	active: MiniPlayerActive | null
	setActive: (next: MiniPlayerActive | null) => void
	clear: () => void
	openFromWatchSnapshot: () => void
}

export const useMiniPlayerStore = create<MiniPlayerState>((set) => ({
	active: null,

	setActive: (next) => set({ active: next }),

	clear: () => set({ active: null }),

	openFromWatchSnapshot: () => {
		const snap = watchMiniSnapshotRef.current
		if (!snap?.videoId || !snap.videoSrc || !snap.title) return
		set({
			active: {
				videoId: snap.videoId,
				videoSrc: snap.videoSrc,
				title: snap.title,
				startTime: snap.currentTime,
				startPaused: snap.paused,
				playbackRate: snap.playbackRate,
				volume: snap.volume,
				muted: snap.muted,
				isHls: snap.isHls,
			},
		})
	},
}))
