export interface IAddVideoRequest {
	file: File
	title: string
	description?: string
	tags?: string
	visibility: 'public' | 'private'
	audience: 'yes' | 'no'
	publishType: 'now' | 'scheduled'
	publishDate?: string
	thumbnail?: File
}

export interface IVideo {
	id: string
	title: string
	description: string | null
	thumbnailFile: string
	videoFile: string
	createdAt: string
	tags?: string | null
	_count: {
		views: number
	}

	user: {
		id: string
		username: string
		name: string
		avatarUrl: string | null
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
