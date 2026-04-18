import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useMarkNotificationRead } from '@/hooks/notification/useMarkNotificationRead'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notification.types'
import { formatDate } from '@/utils/formatDate'
import { getInitials } from '@/utils/get-initials'
import { getNotificationUrl } from '@/utils/getNotificationUrl'
import { renderNotificationText } from '@/utils/renderNotificationText'
import { truncateName } from '@/utils/truncateName'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {} from './NotificationDropdown'

interface INotificationItemProps {
	n: Notification
}

export function NotificationItem({ n }: INotificationItemProps) {
	const t = useTranslations('notifications')
	const { markRead } = useMarkNotificationRead()

	const isFromChannelOwner = n.author?.id === n.channel?.userId

	const displayName = isFromChannelOwner ? n.channel?.name : n.author?.username

	const displayAvatar = isFromChannelOwner
		? n.channel?.avatarUrl
		: n.author?.avatarUrl

	const displayInitials = isFromChannelOwner
		? getInitials(n.channel?.name || '')
		: getInitials(n.author?.username || '')

	return (
		<DropdownMenuItem
			asChild
			className={cn('flex items-start gap-3 px-4 py-3 cursor-pointer')}
			onClick={() => markRead(n.id)}
		>
			<Link href={getNotificationUrl(n)} className=''>
				<Avatar className='w-10 h-10'>
					<AvatarImage src={displayAvatar || undefined} />
					<AvatarFallback>{displayInitials}</AvatarFallback>
				</Avatar>
				<div className='flex gap-3 w-full items-center'>
					<div className='flex flex-col text-sm leading-tight'>
						<span className=''>
							{truncateName(renderNotificationText(n, displayName, t), 200)}
						</span>
						<span className='text-[11px] text-muted-foreground mt-1 '>
							{formatDate(n.createdAt)}
						</span>
					</div>
					{n.video?.thumbnailFile && (
						<img
							src={n.video.thumbnailFile}
							className='ml-auto mr-4 h-10 w-16 rounded object-cover'
						/>
					)}
					{n.isRead === false && (
						<div className='w-[8px] h-[8px] bg-primary rounded absolute top-1/2 -translate-y-1/2 right-3'></div>
					)}
				</div>
			</Link>
		</DropdownMenuItem>
	)
}
