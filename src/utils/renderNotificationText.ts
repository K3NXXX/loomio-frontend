import { type Notification, NotificationType } from '@/types/notification.types'

export function renderNotificationText(n: Notification, displayName: string) {
	switch (n.type) {
		case NotificationType.COMMENT_NEW:
			return `@${n.author?.username} commented your video`
		case NotificationType.COMMENT_REPLY:
			return `@${displayName} replied to your comment`
		case NotificationType.LIKE_VIDEO:
			return `@${n.author?.username} liked your video`
		case NotificationType.DISLIKE_VIDEO:
			return `@${n.author?.username} disliked your video`
		case NotificationType.VIDEO_PUBLISHED:
			return `New video from ${displayName}`
		case NotificationType.CHANNEL_NEW_FOLLOWER:
			return `@${n.author?.username} followed your channel`
		default:
			return n.message
	}
}
