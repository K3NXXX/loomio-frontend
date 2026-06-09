export function getPlaylistVideosInWatchOrder<T extends { id: string }>(
	videos: T[],
): T[] {
	return [...videos].reverse()
}

export function getNextPlaylistVideo<T extends { id: string }>(
	videos: T[],
	currentVideoId: string,
): T | null {
	const ordered = getPlaylistVideosInWatchOrder(videos)
	const index = ordered.findIndex((v) => v.id === currentVideoId)
	if (index < 0 || index + 1 >= ordered.length) return null
	return ordered[index + 1]
}
