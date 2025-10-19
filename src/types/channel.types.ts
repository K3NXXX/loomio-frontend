export interface ICreateChannelRequest {
	name: string
	username: string
	avatarUrl?: File
}

export interface IChannel {
	id: string
	name: string
	username: string
	avatarUrl: string | null
	createdAt: Date
	updatedAt: Date
}
