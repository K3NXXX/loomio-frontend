import type { IChannel } from './channel.types'
import type { IVideo } from './video.types'

export interface ISearchSuggestion {
	id: string
	label: string
	type: 'video' | 'channel'
}

export interface ISearchResponse {
	videos: IVideo[]
	channels: IChannel[]
}
