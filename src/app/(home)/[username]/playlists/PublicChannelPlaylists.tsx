'use client'

import { UserPlaylistsListSkeleton } from '@/components/skeletons/playlists/UserPlaylistsListSkeleton'
import { PAGES } from '@/constants/pages.constants'
import { useGetChannelPlaylists } from '@/hooks/playlists/useGetChannelPlaylists'
import { formatDate } from '@/utils/formatDate'
import { truncateName } from '@/utils/truncateName'
import { useChannelStore } from '@/zustand/store/channelStore'
import { motion } from 'framer-motion'
import { ListVideo } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function PublicChannelPlaylists() {
	const t = useTranslations()
	const { channel } = useChannelStore()
	const { channelPlaylists, isLoading, isError } = useGetChannelPlaylists(
		channel?.id,
	)
	const router = useRouter()

	if (isLoading) return <UserPlaylistsListSkeleton />

	if (isError)
		return (
			<div className='text-destructive text-center py-10'>
				{t('playlists.loadError')}
			</div>
		)

	if (!channelPlaylists?.length)
		return (
			<div className='mt-8 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground'>
				{t('channelPage.tabs.playlistsEmpty')}
			</div>
		)

	return (
		<div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
			{channelPlaylists.map((playlist, index) => (
				<motion.div
					key={playlist.id}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.3, delay: index * 0.05 }}
					onClick={() =>
						router.push(
							PAGES.WATCH_WITH_PLAYLIST(playlist.videos[0]?.id, playlist.id),
						)
					}
					className='group block rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-card cursor-pointer'
				>
					<div className='relative w-full' style={{ paddingTop: '56.25%' }}>
						{playlist.coverUrl ? (
							<Image
								src={playlist.coverUrl}
								alt={playlist.name}
								fill
								unoptimized
								sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw'
								className='object-cover'
							/>
						) : (
							<div className='absolute inset-0 flex items-center justify-center bg-muted'>
								<ListVideo className='w-10 h-10 text-muted-foreground' />
							</div>
						)}

						<div className='absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur'>
							<ListVideo className='w-4 h-4' />
							<span>{t('playlists.playlist')}</span>
						</div>

						<div className='absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur'>
							<ListVideo className='w-3 h-3' />
							<span>
								{t('playlists.videoCount', { count: playlist._count.videos })}
							</span>
						</div>
					</div>
					<div className='absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur'>
						<ListVideo className='w-3 h-3' />
						<span>{t('playlists.playlist')}</span>
					</div>

					<div className='p-3'>
						<h3 className='line-clamp-2 font-semibold leading-tight'>
							{truncateName(playlist.name, 40)}
						</h3>
						<div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
							{playlist.description && (
								<>
									<span className='line-clamp-1'>{playlist.description}</span>
									<span>•</span>
								</>
							)}
							<span>{formatDate(playlist.createdAt)}</span>
						</div>
					</div>
				</motion.div>
			))}
		</div>
	)
}
