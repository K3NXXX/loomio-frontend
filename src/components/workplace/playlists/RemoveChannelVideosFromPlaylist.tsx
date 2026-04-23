'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRemoveVideosFromPlaylist } from '@/hooks/playlists/useRemoveVideosFromPlaylist'
import { formatDate } from '@/utils/formatDate'
import { Search, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	playlistId: string
	existingVideos: {
		id: string
		title: string
		thumbnailFile: string
		createdAt: string
	}[]
}

export function RemoveChannelVideosFromPlaylist({
	isOpen,
	onOpenChange,
	playlistId,
	existingVideos,
}: Props) {
	const t = useTranslations()
	const { removeVideosFromPlaylist, isPending } = useRemoveVideosFromPlaylist()
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const [search, setSearch] = useState('')

	const filtered = existingVideos.filter((v) =>
		v.title.toLowerCase().includes(search.toLowerCase()),
	)

	const toggleSelect = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
		)
	}

	const handleRemove = async () => {
		await removeVideosFromPlaylist({ playlistId, videoIds: selectedIds })
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
					<DialogTitle>{t('playlists.removeVideos')}</DialogTitle>
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

				<div className='flex-1 overflow-y-auto flex flex-col gap-1 pr-1 min-h-0'>
					{!filtered.length ? (
						<div className='flex-1 flex items-center justify-center text-muted-foreground py-10'>
							{t('playlists.noVideosToAdd')}
						</div>
					) : (
						filtered.map((video) => {
							const isSelected = selectedIds.includes(video.id)
							return (
								<div
									key={video.id}
									onClick={() => toggleSelect(video.id)}
									className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${
										isSelected
											? 'bg-destructive/10 border-destructive/30'
											: 'border-transparent hover:bg-muted/40'
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
												? 'bg-destructive border-destructive'
												: 'border-muted-foreground'
										}`}
									>
										{isSelected && (
											<Trash2 className='w-2.5 h-2.5 text-white' />
										)}
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
							variant='destructive'
							onClick={handleRemove}
							disabled={!selectedIds.length || isPending}
							className='flex items-center gap-2'
						>
							<Trash2 className='w-4 h-4' />
							{t('playlists.removeSelected')}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
