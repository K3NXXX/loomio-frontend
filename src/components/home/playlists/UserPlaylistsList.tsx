'use client'

import { UserPlaylistsListSkeleton } from '@/components/skeletons/playlists/UserPlaylistsListSkeleton'
import { PAGES } from '@/constants/pages.constants'
import { useGetMyPlaylists } from '@/hooks/playlists/useGetMyPlaylists'
import { formatDate } from '@/utils/formatDate'
import { truncateName } from '@/utils/truncateName'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { MdPlaylistPlay } from 'react-icons/md'
import { PlaylistActionsDropdown } from './PlaylistActionsDropdown'

export function UserPlaylistsList() {
	const t = useTranslations()
	const { allMyPlaylists, isLoading } = useGetMyPlaylists()
	const router = useRouter()

	if (isLoading) return <UserPlaylistsListSkeleton />

	if (!allMyPlaylists?.length)
		return (
			<p className='text-center text-muted-foreground mt-10'>
				{t('playlists.emptyState')}
			</p>
		)

	return (
		<div className='grid grid-cols-3 max-[1200px]:grid-cols-2 max-[800px]:grid-cols-1 gap-5'>
			{allMyPlaylists.map((playlist, i) => (
				<motion.div
					key={playlist.id}
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: i * 0.05 }}
					onClick={() => router.push(PAGES.ONE_USER_PLAYLIST(playlist.id))}
					className='group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg border border-border bg-card'
				>
					<div className='relative w-full aspect-video overflow-hidden'>
						{playlist.coverUrl ? (
							<img
								src={playlist.coverUrl}
								alt={playlist.name}
								className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-90 group-hover:brightness-100'
							/>
						) : (
							<div className='w-full h-full flex items-center justify-center bg-muted'>
								<MdPlaylistPlay className='text-muted-foreground text-7xl group-hover:text-primary/70 transition-colors duration-300' />
							</div>
						)}

						<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

						<div className='absolute top-3 right-3'>
							<span className='bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/10'>
								{t('playlists.videoCount', { count: playlist._count.videos })}
							</span>
						</div>

						<div className='absolute bottom-0 left-0 right-0 p-4'>
							<h3 className='text-white font-bold text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-200'>
								{truncateName(playlist.name, 30)}
							</h3>
						</div>
					</div>

					<div className='bg-card border-t border-border px-4 py-3 flex items-center justify-between gap-3'>
						<div className='min-w-0'>
							<p className='text-xs text-muted-foreground line-clamp-1'>
								{playlist.description || t('playlists.noDescription')}
							</p>
							<p className='text-[11px] font-semibold text-muted-foreground/80 mt-0.5'>
								{formatDate(playlist.createdAt)}
							</p>
						</div>

						<div className='shrink-0' onClick={(e) => e.stopPropagation()}>
							<PlaylistActionsDropdown
								playlistId={playlist.id}
								initialData={playlist}
							/>
						</div>
					</div>
				</motion.div>
			))}
		</div>
	)
}
