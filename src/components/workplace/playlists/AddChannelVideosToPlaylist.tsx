'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAddVideosToPlaylist } from '@/hooks/playlists/useAddVideosToPlaylist'
import { useAddVideoToPlaylist } from '@/hooks/videos/useAddVideoToPlaylist'
import { useGetChannelStudioVideos } from '@/hooks/videos/useGetChannelStudioVideos'
import { formatDate } from '@/utils/formatDate'
import { Check, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

interface AddVideosToPlaylistModalProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	playlistId: string
	channelId: string
	existingVideoIds: string[]
}

export function AddChannelVideosToPlaylist({
	isOpen,
	onOpenChange,
	playlistId,
	channelId,
	existingVideoIds,
}: AddVideosToPlaylistModalProps) {
	const t = useTranslations()
	const { videos, isLoading } = useGetChannelStudioVideos(channelId)
	const { addVideosToPlaylist, isPending } = useAddVideosToPlaylist()
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const [search, setSearch] = useState('')

	const availableVideos =
		videos
			?.filter((v) => !existingVideoIds.includes(v.id))
			?.filter((v) => v.title.toLowerCase().includes(search.toLowerCase())) ??
		[]

	const toggleSelect = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
		)
	}

const handleAdd = async () => {
    await addVideosToPlaylist({ playlistId, videoIds: selectedIds })
    setSelectedIds([])
    setSearch('')
    onOpenChange(false)
}

	const handleClose = (open: boolean) => {
		if (!open) {
			setSelectedIds([])
			setSearch('')
		}
		onOpenChange(open)
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className='max-w-3xl w-full flex flex-col h-[70vh]'>
				<DialogHeader>
					<DialogTitle>{t('playlists.addVideos')}</DialogTitle>
				</DialogHeader>

				<div className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t('playlists.searchVideos')}
						className='pl-9'
					/>
				</div>

				<div className='flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-0'>
					{isLoading ? (
						<div className='flex-1 flex items-center justify-center text-muted-foreground py-10'>
							{t('common.loading')}
						</div>
					) : !availableVideos.length ? (
						<div className='flex-1 flex items-center justify-center text-muted-foreground py-10'>
							{t('playlists.noVideosToAdd')}
						</div>
					) : (
						availableVideos.map((video) => {
							const isSelected = selectedIds.includes(video.id)
							return (
								<div
									key={video.id}
									onClick={() => toggleSelect(video.id)}
									className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
										isSelected
											? 'bg-primary/10 border border-primary/30'
											: 'hover:bg-muted/40 border border-transparent'
									}`}
								>
									<div className='relative w-24 shrink-0 aspect-video rounded-md overflow-hidden bg-muted'>
										<Image
											src={video.thumbnailFile}
											alt={video.title}
											fill
											unoptimized
											className='object-cover'
										/>
									</div>

									<div className='flex-1 min-w-0'>
										<p className='font-medium text-sm line-clamp-1'>
											{video.title}
										</p>
										<p className='text-xs text-muted-foreground mt-0.5'>
											{formatDate(video.createdAt)}
										</p>
									</div>

									<div
										className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
											isSelected
												? 'bg-primary border-primary'
												: 'border-muted-foreground'
										}`}
									>
										{isSelected && <Check className='w-2.5 h-2.5 text-white' />}
									</div>
								</div>
							)
						})
					)}
				</div>

				<div className='flex items-center justify-between pt-4 border-t border-border/40'>
					<span className='text-sm text-muted-foreground'>
						{t('playlists.selectedCount', { count: selectedIds.length })}
					</span>
					<div className='flex gap-2'>
						<Button variant='outline' onClick={() => handleClose(false)}>
							{t('common.cancel')}
						</Button>
						<Button
							onClick={handleAdd}
							disabled={!selectedIds.length || isPending}
						>
							{t('playlists.addSelected')}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
