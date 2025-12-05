import { PAGES } from '@/constants/pages.constants'
import { type Notification, NotificationType } from '@/types/notification.types'

export function getNotificationUrl(n: Notification) {
	switch (n.type) {
		case NotificationType.LIKE_VIDEO:
		case NotificationType.DISLIKE_VIDEO:
		case NotificationType.COMMENT_NEW:
		case NotificationType.COMMENT_REPLY:
			if (n.comment?.id) {
				return PAGES.WATCH_WITH_COMMENT(n.video?.id ?? '', n.comment.id)
			}
			return PAGES.WATCH(n.video?.id ?? '')
		case NotificationType.VIDEO_PUBLISHED:
			return PAGES.WATCH(n.video?.id ?? '')

		case NotificationType.CHANNEL_NEW_FOLLOWER:
			return PAGES.WORKPLACE_DASHBOARD(n.channel?.username)

		case NotificationType.VIDEO_RESTRICTED:
			return PAGES.WORKPLACE_CONTENT(n.channel?.username)

		default:
			return '#'
	}
}
