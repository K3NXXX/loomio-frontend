'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useGetUserChannels } from '@/hooks/channel/useGetUserChannels'
import { useDeleteChannelNotifications } from '@/hooks/notification/useDeleteChannelNotifications'
import { useDeletePersonalNotifications } from '@/hooks/notification/useDeletePersonalNotifications'
import { useGetNotifications } from '@/hooks/notification/useGetNotification'
import { useMarkAllChannelRead } from '@/hooks/notification/useMarkAllChannelRead'
import { useMarkAllPersonalRead } from '@/hooks/notification/useMarkAllPersonalRead'
import {
	PERSONAL_ACTIVITY_NOTIFICATION_TYPES,
	NotificationType,
} from '@/types/notification.types'
import { getInitials } from '@/utils/get-initials'
import { useState } from 'react'
import { BiCheckDouble } from 'react-icons/bi'
import { FaBell } from 'react-icons/fa'
import { TiDelete } from 'react-icons/ti'
import { NotificationItem } from './NotificationItem'
import { useTranslations } from 'next-intl'

export function NotificationDropdown() {
	const { userData } = useGetMe()
	const { userChannels = [] } = useGetUserChannels({
		enabled: Boolean(userData),
	})
	const { notifications = [], unreadCount } = useGetNotifications()

	const unreadText = unreadCount > 9 ? '9+' : unreadCount
	const { deleteChannelNotifications } = useDeleteChannelNotifications()
	const { deletePersonalNotifications } = useDeletePersonalNotifications()
	const { markAllChannelRead } = useMarkAllChannelRead()
	const { markAllPersonalRead } = useMarkAllPersonalRead()
	const t = useTranslations()


	const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
	const [personalOpen, setPersonalOpen] = useState<boolean>(false)

	const channelFiltered = selectedChannel
		? notifications.filter(
				(n) =>
					n.channel?.id === selectedChannel &&
					n.type !== NotificationType.COMMENT_REPLY &&
					n.type !== NotificationType.LIKE_COMMENT,
			)
		: []

	const personalNotifications = notifications.filter((n) =>
		PERSONAL_ACTIVITY_NOTIFICATION_TYPES.includes(n.type),
	)

	const personalUnread = personalNotifications.filter((n) => !n.isRead).length

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className='relative p-2 rounded-full hover:bg-muted cursor-pointer focus:outline-none'>
					<FaBell className='size-5' />

					{unreadCount > 0 && (
						<span
							className='absolute -right-1 -top-1 min-w-[18px] h-[18px] px-[5px] rounded-full 
							bg-primary text-white text-[10px] font-semibold flex items-center justify-center shadow-sm'
						>
							{unreadText}
						</span>
					)}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align='end'
				className='w-106 max-h-[500px] p-0 overflow-hidden'
			>
				{!selectedChannel && !personalOpen && (
					<>
						<DropdownMenuLabel className='px-4 py-2 text-base font-semibold'>
							{t('notifications.title')}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />

						<ScrollArea className='h-[500px]'>
							<DropdownMenuItem
								onSelect={(e) => e.preventDefault()}
								onClick={() => setPersonalOpen(true)}
								className='flex items-center gap-3 px-4 py-3 cursor-pointer'
							>
								<div className='flex flex-col'>
									<span className='font-medium'>
										{t('notifications.personalActivity')}
									</span>
									<span className='text-xs text-muted-foreground'>
										{t('notifications.repliesAndCreators')}
									</span>
								</div>

								{personalUnread > 0 && (
									<span className='ml-auto bg-primary text-white text-xs px-2 py-1 rounded-full'>
										{personalUnread > 9 ? '9+' : personalUnread}
									</span>
								)}
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							{userChannels.map((ch) => {
								const count = notifications.filter(
									(n) =>
										!n.isRead &&
										n.channel?.id === ch.id &&
										n.type !== NotificationType.COMMENT_REPLY,
								).length

								return (
									<DropdownMenuItem
										key={ch.id}
										onClick={() => setSelectedChannel(ch.id)}
										onSelect={(e) => e.preventDefault()}
										className='flex items-center gap-3 px-4 py-3 cursor-pointer'
									>
										<Avatar className='h-10 w-10'>
											<AvatarImage src={ch.avatarUrl ?? undefined} />
											<AvatarFallback>{getInitials(ch.name)}</AvatarFallback>
										</Avatar>

										<div className='flex flex-col'>
											<span className='font-medium'>{ch.name}</span>
											<span className='text-xs text-muted-foreground'>
												@{ch.username}
											</span>
										</div>

										{count > 0 && (
											<span className='ml-auto bg-primary text-white text-xs px-2 py-1 rounded-full'>
												{count > 9 ? '9+' : count}
											</span>
										)}
									</DropdownMenuItem>
								)
							})}
						</ScrollArea>
					</>
				)}

				{selectedChannel && (
					<>
						<DropdownMenuLabel className='px-4 py-2 text-base font-semibold flex items-center justify-between'>
							<span>{t('notifications.channelNotifications')}</span>

							<div className='flex items-center gap-4'>
								<button
									title={t('notifications.markAllAsRead')}
									onClick={(e) => {
										e.preventDefault()
										markAllChannelRead(selectedChannel)
									}}
									className='text-muted-foreground hover:text-primary transition cursor-pointer'
								>
									<BiCheckDouble className='w-5 h-5' />
								</button>

								<button
									title={t('notifications.deleteAllNotifications')}
									onClick={(e) => e.preventDefault()}
									className='text-muted-foreground hover:text-primary transition cursor-pointer'
								>
									<TiDelete
										onClick={() => deleteChannelNotifications(selectedChannel)}
										className='w-5 h-5'
									/>
								</button>

								<button
									onClick={(e) => {
										e.preventDefault()
										setSelectedChannel(null)
									}}
									className='text-primary text-sm cursor-pointer hover:underline'
								>
									{t('notifications.back')}
								</button>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<ScrollArea className='h-[431px]'>
							{channelFiltered.length === 0 ? (
								<div className='px-4 py-6 text-center text-sm text-muted-foreground'>
									{t('notifications.noNotifications')}
								</div>
							) : (
								channelFiltered.map((n) => (
									<NotificationItem key={n.id} n={n} />
								))
							)}
						</ScrollArea>
					</>
				)}

				{personalOpen && (
					<>
						<DropdownMenuLabel className='px-4 py-2 text-base font-semibold flex items-center justify-between'>
							<span>{t('notifications.personalNotifications')}</span>

							<div className='flex items-center gap-4'>
								<button
									title={t('notifications.markAllAsRead')}
									onClick={(e) => {
										e.preventDefault()
										markAllPersonalRead()
									}}
									className='text-muted-foreground hover:text-primary transition cursor-pointer'
								>
									<BiCheckDouble className='w-5 h-5' />
								</button>

								<button
									title={t('notifications.deleteAllNotifications')}
									onClick={(e) => {
										deletePersonalNotifications()
										e.preventDefault()
									}}
									className='text-muted-foreground hover:text-primary transition cursor-pointer'
								>
									<TiDelete className='w-5 h-5' />
								</button>

								<button
									onClick={(e) => {
										e.preventDefault()
										setPersonalOpen(false)
									}}
									className='text-primary text-sm cursor-pointer hover:underline'
								>
									{t('notifications.back')}
								</button>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<ScrollArea className='h-[431px]'>
							{personalNotifications.length === 0 ? (
								<div className='px-4 py-6 text-center text-sm text-muted-foreground'>
									{t('notifications.noPersonalActivity')}
								</div>
							) : (
								personalNotifications.map((n) => (
									<NotificationItem key={n.id} n={n} />
								))
							)}
						</ScrollArea>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
