'use client'

import { CreatePlaylistModal } from '@/components/home/playlists/CreatePlaylistModal'
import { UserPlaylistsList } from '@/components/home/playlists/UserPlaylistsList'
import { Button } from '@/components/ui/button'
import { ChannelPlaylistsList } from '@/components/workplace/playlists/ChannelPlaylistsList'
import { useChannelStore } from '@/zustand/store/channelStore'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'

interface PlaylistsProps {
	channelId?: string
}

export function Playlists({ }: PlaylistsProps) {
	const t = useTranslations()
	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
	const { channel } = useChannelStore()

	const isChannel = !!channel?.id

	return (
		<div className='px-1 py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className='max-w-6xl mx-auto'
			>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className='relative rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-10'
				>
					<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

					<div className='p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6'>
						<div className='text-center sm:text-left'>
							<h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>
								{isChannel ? t('playlists.channelTitle') : t('playlists.title')}
							</h1>
							<p className='text-muted-foreground mt-1 text-sm sm:text-base'>
								{isChannel
									? t('playlists.channelDescription')
									: t('playlists.description')}
							</p>
						</div>

						<Button
							onClick={() => setIsCreateFormOpen(true)}
							className='flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-2 sm:py-3 font-semibold rounded-full text-sm sm:text-[16px] bg-[var(--primary)] text-white shadow-md hover:bg-[var(--primary)]/90 hover:shadow-lg active:scale-95 active:brightness-90 transition-all duration-300 w-full sm:w-auto justify-center'
						>
							<FaPlus className='text-sm sm:text-base' />
							{isChannel
								? t('playlists.createChannelButton')
								: t('playlists.createButton')}
						</Button>
					</div>
				</motion.div>

				{isChannel ? (
					<ChannelPlaylistsList channelId={channel?.id!} channelUsername={channel?.username} />
				) : (
					<UserPlaylistsList />
				)}
			</motion.div>

			<CreatePlaylistModal
				open={isCreateFormOpen}
				onOpenChange={setIsCreateFormOpen}
				channelId={channel?.id} 
			/>
		</div>
	)
}
