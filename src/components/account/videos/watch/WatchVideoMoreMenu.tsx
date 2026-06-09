'use client'

import { AddToPlaylistModal } from '@/components/home/playlists/AddToPlaylistModal'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ShareVideoModal } from '@/components/ui/custom/ShareVideoModal'
import { useAuthGate } from '@/hooks/auth/useAuthGate'
import { useGetMe } from '@/hooks/auth/useGetMe'
import type { IVideo } from '@/types/video.types'
import { MoreVertical, PlusCircle, Share, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, type MouseEvent } from 'react'
import { TbMessageReportFilled } from 'react-icons/tb'
import { WatchReportVideoModal } from './WatchReportVideoModal'

interface IWatchVideoMoreMenuProps {
	videoId: string
	videoAuthorId: string
	video?: IVideo | null
	hideReport?: boolean
	removeFromPlaylist?: {
		onRemove: () => void
	}
}

export function WatchVideoMoreMenu({
	videoId,
	videoAuthorId,
	video,
	hideReport = false,
	removeFromPlaylist,
}: IWatchVideoMoreMenuProps) {
	const t = useTranslations()
	const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false)
	const [isShareOpen, setIsShareOpen] = useState(false)
	const [isReportOpen, setIsReportOpen] = useState(false)

	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const { userData } = useGetMe()
	const { requireAuth } = useAuthGate()

	const handleAddToPlaylistClick = (e: MouseEvent) => {
		e.stopPropagation()
		setIsDropdownOpen(false)
		if (!requireAuth()) return
		setIsAddToPlaylistOpen(true)
	}

	const handleOpenShare = () => {
		setIsDropdownOpen(false)
		setIsShareOpen(true)
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
							<MoreVertical className='size-4 group-hover:scale-110 transition-transform' />
						</Button>
					</DropdownMenuTrigger>
				</div>
				<DropdownMenuContent align='start' className='w-48'>
					<DropdownMenuItem
						onClick={handleAddToPlaylistClick}
						className='flex items-center gap-2 cursor-pointer'
					>
						<PlusCircle className='size-4 text-muted-foreground' />
						{t('watchMoreMenu.addToPlaylist')}
					</DropdownMenuItem>
					{video ? (
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation()
								handleOpenShare()
							}}
							className='flex items-center gap-2 cursor-pointer'
						>
							<Share className='size-4 text-muted-foreground' />
							{t('watchActions.share')}
						</DropdownMenuItem>
					) : null}
					{removeFromPlaylist ? (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant='destructive'
								onClick={(e) => {
									e.stopPropagation()
									setIsDropdownOpen(false)
									removeFromPlaylist.onRemove()
								}}
								className='flex items-center gap-2 cursor-pointer'
							>
								<Trash2 className='size-4' />
								{t('playlists.removeFromPlaylist')}
							</DropdownMenuItem>
						</>
					) : null}
					{!hideReport && userData && userData.id !== videoAuthorId ? (
						<>
							<DropdownMenuSeparator />
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
						</>
					) : null}
				</DropdownMenuContent>
			</DropdownMenu>

			<AddToPlaylistModal
				videoId={videoId}
				open={isAddToPlaylistOpen}
				onClose={() => setIsAddToPlaylistOpen(false)}
			/>

			{!hideReport ? (
				<WatchReportVideoModal
					open={isReportOpen}
					onOpenChange={setIsReportOpen}
					videoId={videoId}
				/>
			) : null}

			{video ? (
				<ShareVideoModal
					video={video}
					open={isShareOpen}
					onClose={() => setIsShareOpen(false)}
				/>
			) : null}
		</>
	)
}
