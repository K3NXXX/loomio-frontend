'use client'

import { CreatePlaylistModal } from '@/components/home/playlists/CreatePlaylistModal'
import { UserPlaylistsList } from '@/components/home/playlists/UserPlaylistsList'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'

export function Playlists() {
	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)

	return (
		<div className='px-4 py-10'>
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

					<div className='p-6 flex flex-col md:flex-row md:items-center justify-between gap-6'>
						<div>
							<h1 className='text-3xl font-bold tracking-tight'>
								My Playlists
							</h1>
							<p className='text-muted-foreground mt-1'>
								Organize and enjoy your favorite video collections
							</p>
						</div>

						<Button
							onClick={() => setIsCreateFormOpen(true)}
							className='flex items-center gap-3 px-8 py-3 font-semibold rounded-full text-[16px] bg-[var(--primary)] text-white shadow-md hover:bg-[var(--primary)]/90 hover:shadow-lg active:scale-95 active:brightness-90 transition-all duration-300'
						>
							<FaPlus />
							Create playlist
						</Button>
					</div>
				</motion.div>

				<UserPlaylistsList />
			</motion.div>

			<CreatePlaylistModal
				open={isCreateFormOpen}
				onOpenChange={setIsCreateFormOpen}
			/>
		</div>
	)
}
