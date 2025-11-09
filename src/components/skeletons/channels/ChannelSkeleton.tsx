'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ChannelSkeleton() {
	return (
		<div className='px-4 py-10'>
			<div className='max-w-[1284px] mx-auto animate-in fade-in duration-300 space-y-6'>
				{/* Banner */}
				<div className='w-full h-[230px] overflow-hidden rounded-2xl border border-border/40 shadow-sm mb-3'>
					<Skeleton className='w-full h-full rounded-2xl' />
				</div>

				{/* Channel info card */}
				<div className='relative rounded-xl border shadow-sm overflow-hidden'>
					<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

					<div className='p-6 flex flex-col sm:flex-row sm:items-center gap-6'>
						{/* Avatar */}
						<div className='w-[160px] h-[160px] rounded-full ring-2 ring-primary/30 shadow-sm shrink-0 overflow-hidden'>
							<Skeleton className='w-full h-full rounded-full' />
						</div>

						{/* Text section */}
						<div className='flex-1 space-y-3'>
							<Skeleton className='h-8 w-[50%] rounded-md' />{' '}
							{/* channel name */}
							<Skeleton className='h-4 w-[40%] rounded-md' /> {/* username */}
							<Skeleton className='h-3 w-[60%] rounded-md' /> {/* stats */}
							<div className='pt-3 space-y-2'>
								<Skeleton className='h-3 w-[90%] rounded-md' />
								<Skeleton className='h-3 w-[70%] rounded-md' />
							</div>
							<div className='flex gap-3 pt-4'>
								<Skeleton className='h-9 w-[120px] rounded-full' />
								<Skeleton className='h-9 w-[150px] rounded-full' />
							</div>
						</div>
					</div>
				</div>

				{/* Video grid (placeholder for ChannelVideoList) */}
				<div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className='block rounded-xl overflow-hidden bg-card shadow-sm'
						>
							<div className='relative w-full rounded-t-xl overflow-hidden'>
								<Skeleton
									className='w-full rounded-t-xl'
									style={{ paddingTop: '56.25%' }}
								/>
							</div>
							<div className='p-3 space-y-2'>
								<Skeleton className='h-4 w-[90%] rounded-md' />
								<Skeleton className='h-4 w-[70%] rounded-md' />
								<div className='flex gap-2 pt-1'>
									<Skeleton className='h-3 w-[50px] rounded-md' />
									<Skeleton className='h-3 w-[40px] rounded-md' />
									<Skeleton className='h-3 w-[60px] rounded-md' />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
