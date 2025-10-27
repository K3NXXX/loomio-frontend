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
import { FaBell, FaPlus, FaRecordVinyl } from 'react-icons/fa'
import { IoHome } from 'react-icons/io5'
import { MdLogout, MdOutlineVideoLibrary } from 'react-icons/md'
import { UploadVideoModal } from '../account/videos/upload/UploadVideoModal'

interface IWorkplaceHeaderProps {
	channel: IChannel
}

export default function WorkplaceHeader({ channel }: IWorkplaceHeaderProps) {
	const { logout } = useLogout()
	const { openUploadingVideo, setOpenUploadingVideo, setUploadChannelId } =
		useVideoStore()

	const handleUploadVideo = () => {
		setUploadChannelId(channel.id)
		setOpenUploadingVideo(true)
	}

	return (
		<div className='sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2'>
			<div className='mx-auto flex h-14 w-full items-center gap-3 px-3 md:px-6 justify-between'>
				<div className='flex min-w-[220px] items-center gap-2'>
					<div className='relative flex items-center justify-center w-8 h-8 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)] transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_var(--color-primary)]'>
						<FaRecordVinyl className='text-primary-foreground text-xl animate-spin-slower' />
					</div>
					<span className='text-white font-extrabold text-[20px] tracking-tight transition-colors duration-300 group-hover:text-primary'>
						Loomio Workplace
					</span>
				</div>

				<div className='flex min-w-[280px] items-center justify-end gap-2'>
					<Button
						onClick={() => handleUploadVideo()}
						variant='outline'
						className='hidden rounded-full px-4 sm:inline-flex'
					>
						<FaPlus className='mr-2 size-4' /> Upload
					</Button>
					<Button variant='ghost' size='icon' className='rounded-full'>
						<FaBell className='size-5' />
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className='size-8 ring-1 ring-border cursor-pointer'>
								<AvatarImage
									src={channel?.avatarUrl || undefined}
									alt='avatar'
								/>
								<AvatarFallback>{getInitials(channel.name)}</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>

						<DropdownMenuContent className='w-56' align='end' sideOffset={30}>
							<div className='flex items-center pl-2'>
								<Avatar className='size-8 ring-1 ring-border cursor-pointer'>
									<AvatarImage
										src={channel?.avatarUrl || undefined}
										alt='avatar'
									/>
									<AvatarFallback>{getInitials(channel.name)}</AvatarFallback>
								</Avatar>
								<div className='px-3 py-2 text-sm font-medium'>
									<div>{channel.name}</div>
									<div className='text-muted-foreground text-xs'>
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
										<MdOutlineVideoLibrary className='size-4' />
										My channel
									</div>
								</Link>
							</DropdownMenuItem>

							<DropdownMenuItem asChild>
								<Link href={PAGES.HOME} className='cursor-pointer'>
									<div className='flex items-center gap-2'>
										<IoHome className='size-4' />
										Home
									</div>
								</Link>
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => logout()}
							>
								<MdLogout className='size-4' />
								Log out
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
