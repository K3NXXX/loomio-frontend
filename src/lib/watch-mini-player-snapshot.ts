export type WatchMiniSnapshot = {
	videoId: string
	videoSrc: string
	title: string
	currentTime: number
	paused: boolean
	playbackRate: number
	volume: number
	muted: boolean
	isHls: boolean
}

export const watchMiniSnapshotRef = {
	current: null as WatchMiniSnapshot | null,
}
