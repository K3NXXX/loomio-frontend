'use client'

import { UserPlaylistsListSkeleton } from '@/components/skeletons/playlists/UserPlaylistsListSkeleton'
import { PAGES } from '@/constants/pages.constants'
import { useGetMyPlaylists } from '@/hooks/playlists/useGetMyPlaylists'
import { formatDate } from '@/utils/formatDate'
import { motion } from 'framer-motion'
import { PlaylistActionsDropdown } from './PlaylistActionsDropdown'
import { useRouter } from 'next/navigation'

export function UserPlaylistsList() {
	const { allMyPlaylists, isLoading } = useGetMyPlaylists()
	const router = useRouter()

	if (isLoading) return <UserPlaylistsListSkeleton />

	if (!allMyPlaylists?.length)
		return (
			<p className='text-center text-muted-foreground mt-10'>
				You don’t have any playlists yet.
			</p>
		)

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
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
									{playlist.name}
								</h3>

								{/* Дуже ВАЖЛИВО */}
								{/* Dropdown не тригерить parent onClick */}
								<div onClick={(e) => e.stopPropagation()}>
									<PlaylistActionsDropdown
										playlistId={playlist.id}
										initialData={playlist}
									/>
								</div>
							</div>

							<p className='text-sm text-neutral-400 line-clamp-2'>
								{playlist.description || 'No description provided'}
							</p>
						</div>

						<div className='flex items-center justify-between mt-4 text-sm text-neutral-500'>
							<span>{playlist._count.videos} videos</span>
							<span>{formatDate(playlist.createdAt)}</span>
						</div>
					</div>
				</motion.div>
			))}
		</div>
	)
}
