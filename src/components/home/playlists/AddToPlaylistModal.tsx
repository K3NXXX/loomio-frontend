'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useGetMyPlaylists } from '@/hooks/playlists/useGetMyPlaylists'
import { useAddVideoToPlaylist } from '@/hooks/videos/useAddVideoToPlaylist'
import { useRemoveVideoFromPlaylist } from '@/hooks/videos/useRemoveVideoFromPlaylist'
import { motion } from 'framer-motion'
import { Loader2, PlusCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { MdPlaylistPlay } from 'react-icons/md'
import { CreatePlaylistModal } from './CreatePlaylistModal'

interface AddToPlaylistModalProps {
	videoId: string
	open: boolean
	onClose: () => void
}

export function AddToPlaylistModal({
	videoId,
	open,
	onClose,
}: AddToPlaylistModalProps) {
	const t = useTranslations()
	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
	const { allMyPlaylists, isLoading } = useGetMyPlaylists()
	const { addVideoToPlaylist } = useAddVideoToPlaylist()
	const { removeVideoFromPlaylist } = useRemoveVideoFromPlaylist()

	const [localPlaylists, setLocalPlaylists] = useState<any[]>([])
	const [processingId, setProcessingId] = useState<string | null>(null)

	useEffect(() => {
		if (allMyPlaylists) setLocalPlaylists(allMyPlaylists)
	}, [allMyPlaylists])

	const handleToggle = (playlistId: string, alreadyContains: boolean) => {
		setProcessingId(playlistId)

		setLocalPlaylists((prev) =>
			prev.map((p) => {
				if (p.id !== playlistId) return p
				return {
					...p,
					videos: alreadyContains
						? p.videos.filter((v: any) => v.id !== videoId)
						: [...(p.videos || []), { id: videoId }],
				}
			}),
		)

		const action = alreadyContains
			? removeVideoFromPlaylist
			: addVideoToPlaylist

		action(
			{ videoId, playlistId },
			{
				onSettled: () => setProcessingId(null),
			},
		)
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='w-full max-w-md p-0 overflow-hidden rounded-2xl border border-border/40 bg-background shadow-xl'>
				<DialogHeader className='p-5 pb-2'>
					<DialogTitle className='text-lg font-semibold text-center'>
						{t('playlists.addToPlaylistTitle')}
					</DialogTitle>
				</DialogHeader>

				<div className='px-3 pb-20'>
					{isLoading ? (
						<div className='flex justify-center py-10'>
							<Loader2 className='animate-spin size-6 text-muted-foreground' />
						</div>
					) : !localPlaylists?.length ? (
						<div className='text-center text-muted-foreground py-10'>
							<p>{t('playlists.emptyState')}</p>
						</div>
					) : (
						<div className='flex flex-col gap-1.5 mt-2 max-h-[320px] overflow-y-auto'>
							{localPlaylists.map((playlist) => {
								const alreadyContains = playlist.videos?.some(
									(v: any) => v.id === videoId,
								)

								const isProcessing = processingId === playlist.id

								return (
									<motion.button
										key={playlist.id}
										whileTap={{ scale: 0.97 }}
										disabled={isProcessing}
										onClick={() => handleToggle(playlist.id, alreadyContains)}
										className={`flex items-center gap-3 px-3 py-2 rounded-xl w-full cursor-pointer
		transition-colors
		bg-secondary/60 hover:bg-secondary/80
		border border-border/40
		${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}
	`}
									>
										<div className='w-16 h-10 rounded-md overflow-hidden shrink-0 bg-muted'>
											{playlist.coverUrl ? (
												<img
													src={playlist.coverUrl}
													alt={playlist.name}
													className='w-full h-full object-cover'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900'>
													<MdPlaylistPlay className='text-[26px] text-neutral-600 shrink-0' />
												</div>
											)}
										</div>

										<div className='flex flex-col flex-1 text-left'>
											<p className='text-sm font-medium text-foreground line-clamp-1'>
												{playlist.name}
											</p>
											<p className='text-xs text-muted-foreground'>
												{t('playlists.videoCount', {
													count: playlist._count.videos,
												})}
											</p>
										</div>

										<div className='flex items-center justify-center w-6'>
											{isProcessing ? (
												<Loader2 className='size-4 animate-spin text-muted-foreground' />
											) : alreadyContains ? (
												<FaCheckCircle className='size-5 text-primary' />
											) : (
												<FaCheckCircle className='size-5 text-muted-foreground/40' />
											)}
										</div>
									</motion.button>
								)
							})}
						</div>
					)}
				</div>

				<div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent'>
					<Button
						onClick={() => setIsCreateFormOpen(true)}
						variant='secondary'
						className='w-full rounded-xl'
					>
						<PlusCircle className='mr-2 size-4' />
						{t('playlists.createNewPlaylist')}
					</Button>
				</div>

				<CreatePlaylistModal
					open={isCreateFormOpen}
					onOpenChange={setIsCreateFormOpen}
				/>
			</DialogContent>
		</Dialog>
	)
}
