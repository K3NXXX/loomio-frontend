'use client'

import { useGlobalStore } from '@/zustand/store/globalStore'
import { IoMenu } from 'react-icons/io5'

import { UploadVideoModal } from '@/components/account/videos/upload/UploadVideoModal'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { useGetUserChannels } from '@/hooks/channel/useGetUserChannels'
import { cn } from '@/lib/utils'
import { useVideoStore } from '@/zustand/store/videoStore'
import { FaPlus } from 'react-icons/fa'
import { Logo } from '../../ui/Logo'
import { Separator } from '../../ui/separator'

import CreateChannelModal from '@/components/account/channels/CreateChannelModal'
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
import { getInitials } from '@/utils/get-initials'
import { useState } from 'react'
import { NotificationDropdown } from '../notifications/NotificationDropdown'
import { HeaderSearch } from './HeaderSearch'

export function HomeHeader() {
	const { toggleSidebarCollapsed } = useGlobalStore()
	const { openUploadingVideo, setOpenUploadingVideo, setUploadChannelId } =
		useVideoStore()
	const { userChannels, isLoading } = useGetUserChannels()

	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)

	const handlePickChannel = (channelId: string) => {
		setUploadChannelId(channelId)
		setOpenUploadingVideo(true)
	}

	return (
		<header
			className={cn(
				'sticky top-0 left-0 right-0 z-50',
				'bg-[oklch(0.19_0_0/0.7)] backdrop-blur-lg',
				'shadow-[0_4px_15px_rgba(0,0,0,0.3)]',
			)}
		>
			<div className='flex flex-col pb-5'>
				<div className='pt-5 pl-6 flex justify-between items-center max-w-[99%] w-full px-3'>
					<Breadcrumb className='flex h-5 items-center space-x-4 text-sm'>
						<IoMenu
							onClick={() => toggleSidebarCollapsed()}
							size={30}
							className='cursor-pointer burger-toggle'
						/>
						<Separator orientation='vertical' />
						<Logo />
					</Breadcrumb>

					<HeaderSearch />
					<div className='flex items-center gap-5'>
						<NotificationDropdown />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									className='
								flex items-center gap-3 px-8 py-3 font-semibold rounded-full text-[16px]
								bg-[var(--primary)] text-white shadow-md
								hover:bg-[var(--primary)]/90 hover:shadow-lg
								active:scale-95 active:brightness-90
								transition-all duration-300
								'
								>
									<FaPlus />
									Upload
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align='end' className='w-72'>
								<DropdownMenuLabel>Select a channel</DropdownMenuLabel>
								<DropdownMenuSeparator />

								{isLoading ? (
									<div className='px-3 py-2 text-sm text-muted-foreground'>
										Loading…
									</div>
								) : !userChannels?.length ? (
									<div className='px-3 py-2 text-sm text-muted-foreground'>
										You have no channels yet.{' '}
										<span
											onClick={() => setIsCreateFormOpen(true)}
											className='text-primary font-bold cursor-pointer pl-1'
										>
											Create new
										</span>
									</div>
								) : (
									<ScrollArea className='max-h-72'>
										{userChannels.map((ch) => (
											<DropdownMenuItem
												key={ch.id}
												onClick={() => handlePickChannel(ch.id)}
												className='cursor-pointer gap-3 py-2'
											>
												<Avatar className='h-10 w-10'>
													<AvatarImage src={ch.avatarUrl ?? undefined} />
													<AvatarFallback>
														{getInitials(ch.name)}
													</AvatarFallback>
												</Avatar>
												<div className='flex flex-col leading-tight'>
													<span className='text-sm font-medium'>{ch.name}</span>
													<span className='text-xs text-muted-foreground'>
														@{ch.username}
													</span>
												</div>
											</DropdownMenuItem>
										))}
									</ScrollArea>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			{openUploadingVideo && (
				<UploadVideoModal
					open={openUploadingVideo}
					onOpenChange={(open) => {
						if (!open) setUploadChannelId(null)
						setOpenUploadingVideo(open)
					}}
				/>
			)}

			<CreateChannelModal
				open={isCreateFormOpen}
				onOpenChange={setIsCreateFormOpen}
			/>
		</header>
	)
}
