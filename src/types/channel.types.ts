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
	description: string
	username: string
	bannerUrl: string | null
	avatarUrl: string | null
	avatarFrameColor?: string | null
	avatarFrameThickness?: string | null
	avatarFrameStyle?: string | null
	createdAt: Date
	updatedAt: Date
	videos: IVideo[]
	_count: {
		followers: number
		videos: number
	}
}

/** Payload of `GET /user/following` — subscriptions list (no `videos` array). */
export interface IFollowedChannel {
	id: string
	name: string
	username: string
	description: string | null
	avatarUrl: string | null
	bannerUrl: string | null
	avatarFrameColor?: string | null
	avatarFrameThickness?: string | null
	avatarFrameStyle?: string | null
	_count: {
		followers: number
		videos: number
	}
}
