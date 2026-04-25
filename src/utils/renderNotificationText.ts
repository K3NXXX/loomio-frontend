import { type Notification, NotificationType } from '@/types/notification.types'

type NotificationTextTranslator = (
	key:
		| 'text.commentNew'
		| 'text.commentReply'
		| 'text.likeVideo'
		| 'text.dislikeVideo'
		| 'text.videoPublished'
		| 'text.channelNewFollower'
		| 'text.videoRestricted',
	values?: Record<string, string | number | Date>,
) => string

export function renderNotificationText(
	n: Notification,
	displayName: string | undefined,
	t: NotificationTextTranslator,
) {
	const authorHandle = n.author?.username ? `@${n.author.username}` : ''
	const replyAuthorHandle = displayName ? `@${displayName}` : ''
	const publishedFromName = displayName ?? ''

	switch (n.type) {
		case NotificationType.COMMENT_NEW:
			return t('text.commentNew', { author: authorHandle })
		case NotificationType.COMMENT_REPLY:
			return t('text.commentReply', { author: replyAuthorHandle })
		case NotificationType.LIKE_VIDEO:
			return t('text.likeVideo', { author: authorHandle })
		case NotificationType.DISLIKE_VIDEO:
			return t('text.dislikeVideo', { author: authorHandle })
		case NotificationType.VIDEO_PUBLISHED:
			return t('text.videoPublished', { name: publishedFromName })
		case NotificationType.CHANNEL_NEW_FOLLOWER:
			return t('text.channelNewFollower', {
				author: authorHandle,
				channelName: n.channel?.name ?? '',
			})
		case NotificationType.VIDEO_RESTRICTED:
			return t('text.videoRestricted', {
				title: n.video?.title ?? '',
				reason: n.message?.toLowerCase() ?? '',
			})

		default:
			return n.message ?? ''
	}
}
