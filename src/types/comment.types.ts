export interface ICreateCommentRequest {
	videoId: string
	content: string
}

interface CommentUser {
	id: string
	username: string
	name: string
	avatarUrl: string | null
}

export interface IVideoComment {
	id: string
	content: string
	parentId: string | null
	createdAt: string
	updatedAt: string
	user: CommentUser
	_count: {
		likes: number
		replies: number
	}
	liked: boolean
}

export interface IVideoCommentsResponse {
	data: IVideoComment[]
	total: number
	page: number
	take: number
	totalPages: number
}

export interface IEditCommentResponse {
	commentId: string
	content: string
	// videoId: string
}
