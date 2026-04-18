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
import { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
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
	const { allMyPlaylists, isLoading, refetch } = useGetMyPlaylists()
	const { addVideoToPlaylist, isPending: isAdding } = useAddVideoToPlaylist()
	const { removeVideoFromPlaylist, isPending: isRemoving } =
		useRemoveVideoFromPlaylist()

	const handleToggle = (playlistId: string, alreadyContains: boolean) => {
		if (alreadyContains) {
			removeVideoFromPlaylist(
				{ videoId, playlistId },
				{
					onSuccess: () => {
						refetch()
					},
				},
			)
		} else {
			addVideoToPlaylist(
				{ videoId, playlistId },
				{
					onSuccess: () => {
						refetch()
					},
				},
			)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				onClick={(e) => e.stopPropagation()}
				className='w-[500px] rounded-2xl border border-border/40 bg-background/95 backdrop-blur p-6 shadow-xl'
			>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold text-center'>
						{t('playlists.addToPlaylistTitle')}
					</DialogTitle>
				</DialogHeader>

				{isLoading ? (
					<p className='text-muted-foreground text-center mt-4'>
						{t('playlists.loadingPlaylists')}
					</p>
				) : !allMyPlaylists?.length ? (
					<div className='text-center text-muted-foreground py-10'>
						<p>{t('playlists.emptyState')}</p>
						<Button
							onClick={() => setIsCreateFormOpen(true)}
							variant='outline'
							className='mt-4'
						>
							<PlusCircle className='mr-2 size-4' />
							{t('playlists.createNewPlaylist')}
						</Button>
					</div>
				) : (
					<div className='flex flex-col gap-3 mt-4 max-h-[350px] overflow-y-auto pr-1'>
						{allMyPlaylists.map((playlist) => {
							const alreadyContains = playlist.videos?.some(
								(v) => v.id === videoId,
							)

							const isProcessing = isAdding || isRemoving

							return (
								<motion.button
									key={playlist.id}
									whileTap={{ scale: 0.97 }}
									disabled={isProcessing}
									onClick={() => handleToggle(playlist.id, alreadyContains)}
									className={`flex items-center justify-between p-4 py-2 rounded-xl border border-border transition-all cursor-pointer
										hover:bg-muted/50 active:scale-[0.98]
										${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}
									`}
								>
									<div className='flex flex-col items-start text-left'>
										<p className='font-medium text-foreground'>
											{playlist.name}
										</p>
										<p className='text-xs text-muted-foreground'>
											{t('playlists.videoCount', {
												count: playlist._count.videos,
											})}
										</p>
									</div>

									{isProcessing ? (
										<Loader2 className='size-5 text-primary animate-spin' />
									) : alreadyContains ? (
										<FaCheckCircle className='size-5 text-primary' />
									) : (
										<FaCheckCircle className='size-5 text-muted-foreground/40' />
									)}
								</motion.button>
							)
						})}
					</div>
				)}
			</DialogContent>
			<CreatePlaylistModal
				open={isCreateFormOpen}
				onOpenChange={setIsCreateFormOpen}
			/>
		</Dialog>
	)
}
