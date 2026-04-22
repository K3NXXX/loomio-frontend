import type { IVideo } from './video.types'

export interface ICreatePlaylistRequest {
	name: string
	description?: string
	cover?: File
	channelId?: string
}

export interface IEditPlaylistRequest {
	name?: string
	description?: string
	cover?: File | null
	removeCover?: boolean
}

export interface IPlaylist {
	id: string
	name: string
	description?: string
	createdAt: string
	updatedAt: string
	coverUrl?: string
	videos: IVideo[]
	_count: {
		videos: number
	}
}
