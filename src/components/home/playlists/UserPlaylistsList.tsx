'use client'

import { UserPlaylistsListSkeleton } from '@/components/skeletons/playlists/UserPlaylistsListSkeleton'
import { PAGES } from '@/constants/pages.constants'
import { useGetMyPlaylists } from '@/hooks/playlists/useGetMyPlaylists'
import { formatDate } from '@/utils/formatDate'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { PlaylistActionsDropdown } from './PlaylistActionsDropdown'
import { truncateName } from '@/utils/truncateName'

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
		<div className='grid grid-cols-3 max-[1200px]:grid-cols-2 max-[800px]:grid-cols-1 gap-6'>
			{allMyPlaylists.map((playlist) => (
				<motion.div
					key={playlist.id}
					transition={{ duration: 0.2 }}
					onClick={() => router.push(PAGES.ONE_USER_PLAYLIST(playlist.id))}
					className='
						group rounded-2xl border border-primary/30 hover:border-primary 
						bg-neutral-100 dark:bg-neutral-900/70 
						hover:bg-neutral-50 dark:hover:bg-neutral-800
						transition-all duration-300 p-5 shadow-md hover:shadow-primary/20 
						cursor-pointer
					'
				>
					<div className='flex flex-col justify-between h-full'>
						<div>
							<div className='flex items-center justify-between mb-2'>
								<h3 className='text-lg font-semibold text-white group-hover:text-primary transition-colors'>
									{truncateName(playlist.name, 25)}
								</h3>

								<div onClick={(e) => e.stopPropagation()}>
									<PlaylistActionsDropdown
										playlistId={playlist.id}
										initialData={playlist}
									/>
								</div>
							</div>

							<p className='text-sm text-neutral-400 line-clamp-2'>
								{playlist.description || t('playlists.noDescription')}
							</p>
						</div>

						<div className='flex items-center justify-between mt-4 text-sm text-neutral-500'>
							<span>
								{t('playlists.videoCount', { count: playlist._count.videos })}
							</span>
							<span>{formatDate(playlist.createdAt)}</span>
						</div>
					</div>
				</motion.div>
			))}
		</div>
	)
}
