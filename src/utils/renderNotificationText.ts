import {
	extractModeratorNoteFromRestrictedNotification,
	parseReportReasonFromNotificationMessage,
} from '@/constants/report-reason.constants'
import { type Notification, NotificationType } from '@/types/notification.types'

type NotificationTextTranslator = (
	key:
		| 'text.commentNew'
		| 'text.commentReply'
		| 'text.likeVideo'
		| 'text.dislikeVideo'
		| 'text.likeComment'
		| 'text.videoPublished'
		| 'text.channelNewFollower'
		| 'text.videoRestricted'
		| 'text.videoApproved',
	values?: Record<string, string | number | Date>,
) => string

/** Resolves `notifications.restrictReason.{code}` */
export type TranslateNotificationRestrictReason = (code: string) => string

function normalizeNotificationType(type: Notification['type']): string {
	return String(type ?? '')
}

export function renderNotificationText(
	n: Notification,
	displayName: string | undefined,
	t: NotificationTextTranslator,
	tRestrictReason?: TranslateNotificationRestrictReason,
) {
	const isChannelOwner = n.author?.id === n.channel?.userId
	const authorHandle = n.author?.username ? `@${n.author.username}` : ''
	const replyAuthorHandle = isChannelOwner
		? (displayName ?? '')
		: displayName
			? `@${displayName}`
			: ''
	const publishedFromName = displayName ?? ''
	const likeCommentAuthor = isChannelOwner
		? (n.channel?.name ?? '')
		: authorHandle

	const typeKey = normalizeNotificationType(n.type)

	switch (typeKey) {
		case NotificationType.COMMENT_NEW:
			return t('text.commentNew', { author: authorHandle })
		case NotificationType.COMMENT_REPLY:
			return t('text.commentReply', { author: replyAuthorHandle })
		case NotificationType.LIKE_VIDEO:
			return t('text.likeVideo', { author: authorHandle })
		case NotificationType.LIKE_COMMENT:
			return t('text.likeComment', { author: likeCommentAuthor })
		case NotificationType.DISLIKE_VIDEO:
			return t('text.dislikeVideo', { author: authorHandle })
		case NotificationType.VIDEO_PUBLISHED:
			return t('text.videoPublished', { name: publishedFromName })
		case NotificationType.CHANNEL_NEW_FOLLOWER:
			return t('text.channelNewFollower', {
				author: authorHandle,
				channelName: n.channel?.name ?? '',
			})
		case NotificationType.VIDEO_APPROVED:
			return t('text.videoApproved', {
				title: n.video?.title ?? '',
			})
		case NotificationType.VIDEO_RESTRICTED: {
			const code = parseReportReasonFromNotificationMessage(n.message)
			const moderatorNote = extractModeratorNoteFromRestrictedNotification(
				n.message,
			)
			const fallback = (n.message ?? '').trim()
			const reasonLabel =
				code != null && tRestrictReason != null
					? tRestrictReason(code)
					: fallback
			const base = t('text.videoRestricted', {
				title: n.video?.title ?? '',
				reason: reasonLabel,
			})
			if (moderatorNote?.trim()) {
				return `${base} ${t('text.videoRestrictedModeratorNote', { note: moderatorNote.trim() })}`
			}
			return base
		}

		default:
			return n.message ?? ''
	}
}
