'use client'

import { FollowingsSkeleton } from '@/components/skeletons/followings/FollowingsSkeleton'
import { PAGES } from '@/constants/pages.constants'
import { useGetFollowedChannels } from '@/hooks/user/useGetFollowedChannels'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function Followings() {
	const { followedChannels, isLoading } = useGetFollowedChannels()

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
					{/* accent stripe */}
					<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

					<div className='p-6 flex flex-col md:flex-row md:items-center justify-between gap-6'>
						<div>
							<h1 className='text-3xl font-bold tracking-tight'>
								Followed Channels
							</h1>
							<p className='text-muted-foreground mt-1'>
								Explore channels you’ve subscribed to
							</p>
						</div>
					</div>
				</motion.div>

				{isLoading ? (
					<FollowingsSkeleton />
				) : !followedChannels?.length ? (
					<p className='text-center text-muted-foreground mt-10'>
						You haven’t followed any channels yet.
					</p>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{followedChannels.map((channel) => (
							<motion.div
								key={channel.id}
								transition={{ duration: 0.2 }}
								className='group rounded-2xl border border-primary/30 hover:border-primary 
									bg-neutral-100 dark:bg-neutral-900/70 
									hover:bg-neutral-50 dark:hover:bg-neutral-800
									transition-all duration-300 p-5 shadow-md hover:shadow-primary/20 
									cursor-pointer'
							>
								<Link href={PAGES.CHANNEL(channel.username)}>
									<div className='flex items-center gap-4'>
										<img
											src={channel.avatarUrl ?? '/default-avatar.png'}
											alt={channel.name}
											className='w-14 h-14 rounded-full object-cover border border-neutral-700'
										/>
										<div>
											<h3 className='text-lg font-semibold text-white group-hover:text-primary transition-colors'>
												{channel.name}
											</h3>
											<p className='text-sm text-neutral-400'>
												@{channel.username}
											</p>
										</div>
									</div>

									{channel.description && (
										<p className='mt-3 text-sm text-neutral-400 line-clamp-2'>
											{channel.description}
										</p>
									)}
								</Link>
							</motion.div>
						))}
					</div>
				)}
			</motion.div>
		</div>
	)
}
