'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function UserPlaylistsListSkeleton() {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className='
						group rounded-2xl border border-primary/30
						bg-neutral-100 dark:bg-neutral-900/70
						p-5 shadow-md transition-all duration-300 min-h-[134px]
					'
				>
					<div className='flex flex-col justify-between h-full'>
						<div>
							<div className='flex items-center justify-between mb-2'>
								<Skeleton className='h-5 w-[70%] rounded-md' />
								<Skeleton className='h-5 w-5 rounded-full' />
							</div>

							<div className='space-y-2'>
								<Skeleton className='h-3 w-full rounded-md' />
								<Skeleton className='h-3 w-[90%] rounded-md' />
							</div>
						</div>

						<div className='flex items-center justify-between mt-4'>
							<Skeleton className='h-3 w-[70px] rounded-md' />
							<Skeleton className='h-3 w-[90px] rounded-md' />
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
