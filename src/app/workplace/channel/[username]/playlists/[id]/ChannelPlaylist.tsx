'use client'

import { WatchVideoMoreMenu } from '@/components/account/videos/watch/WatchVideoMoreMenu'
import { PlaylistActionsDropdown } from '@/components/home/playlists/PlaylistActionsDropdown'
import { PlaylistPageSkeleton } from '@/components/skeletons/playlists/PlaylistPageSkeleton'
import { Button } from '@/components/ui/button'
import { VideoThumbnailDuration } from '@/components/ui/custom/VideoThumbnailDuration'
import { AddChannelVideosToPlaylist } from '@/components/workplace/playlists/AddChannelVideosToPlaylist'
import { RemoveChannelVideosFromPlaylist } from '@/components/workplace/playlists/RemoveChannelVideosFromPlaylist'
import { PAGES } from '@/constants/pages.constants'
import { useGetOneChannelPlaylist } from '@/hooks/playlists/useGetOneChannelPlaylist'
import { useRemoveVideoFromPlaylist } from '@/hooks/videos/useRemoveVideoFromPlaylist'
import { formatDate } from '@/utils/formatDate'
import { truncateName } from '@/utils/truncateName'
import { useChannelStore } from '@/zustand/store/channelStore'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function ChannelPlaylist() {
	const t = useTranslations()
	const { id } = useParams<{ id: string }>()
	const { playlist, isLoading, isError } = useGetOneChannelPlaylist(id)
	const { removeVideoFromPlaylist } = useRemoveVideoFromPlaylist()

	const [isAddModalOpen, setIsAddModalOpen] = useState(false)
	const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
	const { channel } = useChannelStore()

	const handleRemove = (videoId: string, playlistId: string) => {
		removeVideoFromPlaylist({ videoId, playlistId })
	}

	if (isLoading) return <PlaylistPageSkeleton />

	if (isError || !playlist)
		return (
			<div className='min-h-[60vh] flex items-center justify-center text-destructive'>
				{t('playlists.loadError')}
			</div>
		)

	return (
		<div className='px-4 py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className='max-w-[1284px] mx-auto'
			>
				<div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>
							{playlist.name}
						</h1>
						<p className='text-muted-foreground mt-1 text-sm'>
							{t('playlists.videoCount', { count: playlist.videos.length })} ·{' '}
							{t('playlists.created')} {formatDate(playlist.createdAt)}
						</p>
						{playlist.description && (
							<p className='text-muted-foreground text-sm mt-2 max-w-2xl'>
								{playlist.description}
							</p>
						)}
					</div>
					<div className='flex items-center gap-3'>
						<Button
							onClick={() => setIsAddModalOpen(true)}
							className='flex items-center gap-2'
						>
							<Plus className='size-4' />
							{t('playlists.addVideos')}
						</Button>

						<Button
							variant='outline'
							onClick={() => setIsRemoveModalOpen(true)}
							disabled={!playlist.videos.length}
							className='flex items-center gap-2'
						>
							<Trash2 className='size-4' />
							{t('playlists.removeVideos')}
						</Button>
						{channel?.username && (
							<Link
								href={PAGES.WORKPLACE_PLAYLISTS(channel?.username)}
								className='w-max'
							>
								<Button variant='outline' className='flex items-center gap-2'>
									<ArrowLeft className='size-4' />
									{t('playlists.backToPlaylists')}
								</Button>
							</Link>
						)}
						<PlaylistActionsDropdown
							playlistId={playlist.id}
							initialData={playlist}
							isPlaylistPage={true}
						/>
					</div>
				</div>

				{!playlist.videos?.length ? (
					<p className='text-center text-muted-foreground mt-20'>
						{t('playlists.playlistEmpty')}
					</p>
				) : (
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{playlist.videos.map((video, index) => {
							const videoAuthorId =
								video.channel?.userId ?? channel?.userId
							return (
							<motion.div
								key={video.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.3, delay: index * 0.05 }}
								className='relative rounded-2xl border border-border/40 bg-background/60 shadow-sm hover:shadow-md transition-all overflow-hidden'
							>
								<Link href={PAGES.WATCH(video.id)} className='block'>
									<div className='group relative w-full aspect-video overflow-hidden'>
										<img
											src={video.thumbnailFile}
											alt={video.title}
											className='w-full h-full object-cover object-center'
										/>
										<div className='pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors' />
										<div className='pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
											<div className='rounded-full bg-black/60 p-3 backdrop-blur'>
												<Play className='h-5 w-5 text-white' />
											</div>
										</div>
										<VideoThumbnailDuration
											seconds={video.durationSeconds}
											size='default'
										/>
									</div>
								</Link>

								<div className='p-4 flex flex-col gap-1'>
									<div className='flex items-start justify-between gap-2'>
										<Link
											href={PAGES.WATCH(video.id)}
											className='font-semibold line-clamp-2 transition-colors flex-1 min-w-0 hover:text-primary'
										>
											{truncateName(video.title, 40)}
										</Link>

										{videoAuthorId ? (
											<div
												className='shrink-0'
												onClick={(e) => e.stopPropagation()}
											>
												<WatchVideoMoreMenu
													videoId={video.id}
													videoAuthorId={videoAuthorId}
													video={video}
													removeFromPlaylist={{
														onRemove: () =>
															handleRemove(video.id, playlist.id),
													}}
												/>
											</div>
										) : null}
									</div>

									<div className='flex items-center gap-1 text-gray-400 text-sm'>
										<span>
											{t('videoItem.viewsCount', {
												count: video._count?.views,
											})}
										</span>
										<span>•</span>
										<span>{formatDate(video.createdAt)}</span>
									</div>
								</div>
							</motion.div>
							)
						})}
					</div>
				)}
			</motion.div>

			{channel?.id && (
				<AddChannelVideosToPlaylist
					isOpen={isAddModalOpen}
					onOpenChange={setIsAddModalOpen}
					playlistId={playlist.id}
					channelId={channel.id}
					existingVideoIds={playlist.videos.map((v) => v.id)}
				/>
			)}

			{channel?.id && (
				<RemoveChannelVideosFromPlaylist
					isOpen={isRemoveModalOpen}
					onOpenChange={setIsRemoveModalOpen}
					playlistId={playlist.id}
					existingVideos={playlist.videos}
				/>
			)}
		</div>
	)
}
