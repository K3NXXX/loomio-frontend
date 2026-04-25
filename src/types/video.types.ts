export interface IAddVideoRequest {
	title: string
	description?: string
	tags?: string
	visibility: 'public' | 'private'
	audience: 'yes' | 'no'
	thumbnail?: File
	channelId: string | null
	videoPublicId: string
	publishType: 'now' | 'scheduled'
	publishDate?: string
}

export interface IEditVideoRequest {
	title: string
	description?: string
	tags?: string
	visibility: 'public' | 'private'
	audience: 'yes' | 'no'
	thumbnail?: File
	channelId: string | null
	publishType: string
	publishDate?: string | Date | null
}

export interface IVideo {
	id: string
	title: string
	audience: string
	visibility: string
	description: string | null
	thumbnailFile: string
	publishType: string
	publishDate: Date
	videoFile: string
	createdAt: string
	videoPublicId: string
	likesCount: number
	dislikesCount: number
	tags?: string | null
	_count: {
		views: number
		comments: number
	}

	channel: {
		id: string
		username: string
		name: string
		avatarUrl: string | null
		userId: string
		_count: {
			followers: number
		}
	}

	comments: IComment[]
}

export interface IComment {
	id: string
	text: string
	createdAt: string
	user: {
		id: string
		username: string
		avatarUrl: string | null
	}
}
