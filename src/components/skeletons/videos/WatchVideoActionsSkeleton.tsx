'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function WatchVideoActionsSkeleton() {
	return (
		<div className='mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
			<div className='flex items-center gap-4'>
				<Skeleton className='w-12 h-12 rounded-full' />

				<div className='flex flex-col gap-2'>
					<Skeleton className='h-4 w-[120px] rounded-md' />
					<Skeleton className='h-3 w-[90px] rounded-md' />
				</div>

				<Skeleton className='h-10 w-[120px] rounded-full ml-2' />
			</div>

			<div className='flex flex-wrap items-center gap-3 mt-4 md:mt-0'>
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className='h-10 w-[90px] rounded-full' />
				))}
			</div>
		</div>
	)
}
