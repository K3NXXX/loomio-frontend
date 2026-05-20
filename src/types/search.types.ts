import type { IChannel } from './channel.types'
import type { IVideo } from './video.types'

export interface ISearchSuggestion {
	id: string
	label: string
	type: 'video' | 'channel' | 'tag'
	/** Video thumbnail URL or channel avatar URL (from API). */
	imageUrl?: string | null
}

export interface ISearchResponse {
	videos: IVideo[]
	channels: IChannel[]
	page: number
	limit: number
	totalVideos: number
	hasMore: boolean
}
