interface NotificationAuthor {
	id: string
	username: string
	name: string
	avatarUrl: string | null
}

interface NotificationVideo {
	id: string
	title: string
	thumbnailFile: string | null
}

interface NotificationChannel {
	id: string
	name: string
	username: string
	avatarUrl: string | null
}

interface NotificationComment {
	id: string
	content: string
	parentId: string | null
}

export interface Notification {
	id: string
	type: NotificationType
	message: string | null
	isRead: boolean
	createdAt: string

	author: NotificationAuthor | null
	video: NotificationVideo | null
	channel: NotificationChannel | null
	comment: NotificationComment | null
}

export interface INotification {
	unreadCount: number
	notifications: Notification[]
}

export enum NotificationType {
	VIDEO_PUBLISHED = 'VIDEO_PUBLISHED',
	CHANNEL_NEW_FOLLOWER = 'CHANNEL_NEW_FOLLOWER',
	COMMENT_NEW = 'COMMENT_NEW',
	COMMENT_REPLY = 'COMMENT_REPLY',
	LIKE_VIDEO = 'LIKE_VIDEO',
	DISLIKE_VIDEO = 'DISLIKE_VIDEO',
	LIKE_COMMENT = 'LIKE_COMMENT',
}
