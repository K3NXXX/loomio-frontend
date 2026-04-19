'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PAGES } from '@/constants/pages.constants'
import { useLogout } from '@/hooks/auth/useLogout'
import type { IChannel } from '@/types/channel.types'
import { getInitials } from '@/utils/get-initials'
import { useVideoStore } from '@/zustand/store/videoStore'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
	FaPalette,
	FaPlus,
	FaRecordVinyl,
	FaThLarge,
	FaVideo,
} from 'react-icons/fa'
import { IoHome } from 'react-icons/io5'
import { MdDangerous, MdLogout, MdOutlineVideoLibrary } from 'react-icons/md'
import { UploadVideoModal } from '../account/videos/upload/UploadVideoModal'

interface IWorkplaceHeaderProps {
	channel: IChannel
}

export default function WorkplaceHeader({ channel }: IWorkplaceHeaderProps) {
	const t = useTranslations('workplaceHeader')
	const tHeader = useTranslations('header')
	const tUserMenu = useTranslations('userMenu')
	const tSidebar = useTranslations('workplaceSidebar')
	const tSidebarMain = useTranslations('sidebar')
	const { logout } = useLogout()
	const { openUploadingVideo, setOpenUploadingVideo, setUploadChannelId } =
		useVideoStore()

	const handleUploadVideo = () => {
		setUploadChannelId(channel.id)
		setOpenUploadingVideo(true)
	}

	const items = [
		{
			label: tSidebar('dashboard'),
			icon: FaThLarge,
			href: PAGES.WORKPLACE_DASHBOARD(channel.username),
		},
		{
			label: tSidebar('content'),
			icon: FaVideo,
			href: PAGES.WORKPLACE_CONTENT(channel.username),
		},
		{
			label: tSidebar('branding'),
			icon: FaPalette,
			href: PAGES.WORKPLACE_BRANDING(channel.username),
		},
		{
			label: tSidebar('dangerZone'),
			icon: MdDangerous,
			href: PAGES.WORKPLACE_DANGER_ZONE(channel.username),
		},
	]

	return (
		<div className='sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2'>
			<div className='mx-auto flex h-12 min-[400px]:h-14 w-full items-center gap-2 min-[400px]:gap-3 px-2 min-[400px]:px-3 md:px-6 justify-between'>
				<div className='flex items-center gap-1.5 min-[400px]:gap-2 min-w-0'>
					<div className='relative flex shrink-0 items-center justify-center w-7 h-7 min-[400px]:w-8 min-[400px]:h-8 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]'>
						<FaRecordVinyl className='text-primary-foreground text-base min-[400px]:text-xl animate-spin-slower' />
					</div>
					<span className='text-white font-extrabold text-sm min-[400px]:text-base min-[500px]:text-[20px] tracking-tight truncate'>
						{t('brandTitle')}
					</span>
				</div>

				<div className='flex items-center justify-end gap-2 min-[400px]:gap-3 min-[500px]:gap-5 shrink-0'>
					<Button
						onClick={() => handleUploadVideo()}
						variant='outline'
						className='hidden rounded-full px-3 min-[400px]:px-4 text-xs min-[400px]:text-sm sm:inline-flex'
					>
						<FaPlus className='mr-1.5 min-[400px]:mr-2 size-3 min-[400px]:size-4' />
						{tHeader('upload')}
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className='size-7 min-[400px]:size-8 ring-1 ring-border cursor-pointer shrink-0'>
								<AvatarImage
									src={channel?.avatarUrl || undefined}
									alt={t('avatarAlt')}
								/>
								<AvatarFallback className='text-xs'>
									{getInitials(channel.name)}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							className='w-48 min-[400px]:w-56'
							align='end'
							sideOffset={20}
						>
							<div className='flex items-center pl-2'>
								<Avatar className='size-7 min-[400px]:size-8 ring-1 ring-border cursor-pointer shrink-0'>
									<AvatarImage
										src={channel?.avatarUrl || undefined}
										alt={t('avatarAlt')}
									/>
									<AvatarFallback className='text-xs'>
										{getInitials(channel.name)}
									</AvatarFallback>
								</Avatar>
								<div className='px-2 min-[400px]:px-3 py-2 text-xs min-[400px]:text-sm font-medium min-w-0'>
									<div className='truncate'>{channel.name}</div>
									<div className='text-muted-foreground text-[10px] min-[400px]:text-xs truncate'>
										@{channel.username}
									</div>
								</div>
							</div>

							<DropdownMenuSeparator />

							<DropdownMenuItem asChild>
								<Link
									href={PAGES.CHANNEL(channel.username)}
									className='cursor-pointer'
								>
									<div className='flex items-center gap-2'>
										<MdOutlineVideoLibrary className='size-4 shrink-0' />
										<span className='text-xs min-[400px]:text-sm'>
											{t('myChannel')}
										</span>
									</div>
								</Link>
							</DropdownMenuItem>

							<DropdownMenuItem asChild>
								<Link href={PAGES.HOME} className='cursor-pointer'>
									<div className='flex items-center gap-2'>
										<IoHome className='size-4 shrink-0' />
										<span className='text-xs min-[400px]:text-sm'>
											{tSidebarMain('home')}
										</span>
									</div>
								</Link>
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<div className='min-[1200px]:hidden'>
								{items.map((item) => (
									<DropdownMenuItem key={item.href} asChild>
										<Link href={item.href} className='cursor-pointer'>
											<div className='flex items-center gap-2'>
												<item.icon className='size-4 shrink-0' />
												<span className='text-xs min-[400px]:text-sm'>
													{item.label}
												</span>
											</div>
										</Link>
									</DropdownMenuItem>
								))}
								<DropdownMenuSeparator />
							</div>

							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => logout()}
							>
								<MdLogout className='size-4 shrink-0' />
								<span className='text-xs min-[400px]:text-sm'>
									{tUserMenu('logout')}
								</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
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
		</div>
	)
}
