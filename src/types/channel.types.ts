import type { IVideo } from './video.types'

export interface ICreateChannelRequest {
	name: string
	username: string
	avatarUrl?: File
}

export interface IChannel {
	id: string
	userId: string
	name: string
	username: string
	avatarUrl: string | null
	createdAt: Date
	updatedAt: Date
	videos: IVideo[]
	_count: {
		followers: number
		videos: number
	}
}
