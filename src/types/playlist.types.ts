import type { IVideo } from './video.types'

export interface ICreatePlaylistRequest {
	name: string
	description?: string
}

export interface IEditPlaylistRequest {
	name?: string
	description?: string
}

export interface IPlaylist {
	id: string
	name: string
	description?: string
	createdAt: string
	updatedAt: string
	videos: IVideo[]
	_count: {
		videos: number
	}
}
