'use client'

import { AddToPlaylistModal } from '@/components/home/playlists/AddToPlaylistModal'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { TbMessageReportFilled } from 'react-icons/tb'
import { WatchReportVideoModal } from './WatchReportVideoModal'

interface IWatchVideoMoreMenuProps {
	videoId: string
	videoAuthorId: string
}

export function WatchVideoMoreMenu({
	videoId,
	videoAuthorId,
}: IWatchVideoMoreMenuProps) {
	const t = useTranslations()
	const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false)
	const [isReportOpen, setIsReportOpen] = useState(false)

	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const { userData } = useGetMe()

	const handleOpenPlaylistModal = () => {
		setIsDropdownOpen(false)
		setIsAddToPlaylistOpen(true)
	}

	return (
		<>
			<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
				<div onClickCapture={(e) => e.stopPropagation()}>
					<DropdownMenuTrigger asChild>
						<Button
							variant='secondary'
							size='sm'
							className='group rounded-full h-10 w-10 flex items-center justify-center bg-neutral-100/60 dark:bg-neutral-800/60 backdrop-blur hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:shadow-md active:scale-95 transition-all'
						>
							<MoreHorizontal className='size-4 group-hover:scale-110 transition-transform' />
						</Button>
					</DropdownMenuTrigger>
				</div>
				<DropdownMenuContent align='start' className='w-48'>
					<DropdownMenuItem
						onClick={(e) => {
							e.stopPropagation()
							handleOpenPlaylistModal()
						}}
						className='flex items-center gap-2 cursor-pointer'
					>
						<PlusCircle className='size-4 text-muted-foreground' />
						{t('watchMoreMenu.addToPlaylist')}
					</DropdownMenuItem>
					{userData?.id !== videoAuthorId && (
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation()
								setIsDropdownOpen(false)
								setIsReportOpen(true)
							}}
							className='flex items-center gap-2 cursor-pointer'
						>
							<TbMessageReportFilled className='w-4 h-4' />
							{t('watchMoreMenu.report')}
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<AddToPlaylistModal
				videoId={videoId}
				open={isAddToPlaylistOpen}
				onClose={() => setIsAddToPlaylistOpen(false)}
			/>

			<WatchReportVideoModal
				open={isReportOpen}
				onOpenChange={setIsReportOpen}
				videoId={videoId}
			/>
		</>
	)
}
