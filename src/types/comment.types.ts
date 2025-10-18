export interface ICreateCommentRequest {
	videoId: string
	content: string
	parentId?: string
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
	parent: ParentComment | null
	likes: number
	dislikes: number
	userReaction: ReactionType | null
	_count: {
		replies: number
	}
}

export interface ParentComment {
	id: string
	user: {
		username: string
	}
}

export interface IVideoCommentsResponse {
	data: IVideoComment[]
	total: number
	page: number
	take: number
	totalPages: number
}

export interface IEditCommentRequest {
	commentId: string
	content: string
}

export interface IAddCommentReactionRequest {
	commentId: string
	type: ReactionType
}

export enum ReactionType {
	LIKE = 'LIKE',
	DISLIKE = 'DISLIKE',
}
