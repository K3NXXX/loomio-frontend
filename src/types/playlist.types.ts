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
	_count: {
		videos: number
	}
}
