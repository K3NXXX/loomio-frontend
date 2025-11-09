'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function WatchRecommendedVideosSkeleton() {
	return (
		<div className='w-[25%] flex-shrink-0 relative -top-2'>
			<div className='flex flex-col gap-4'>
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className='flex gap-3 rounded-lg p-2'>
						<div className='relative min-w-[168px] max-w-[168px] aspect-video rounded-md overflow-hidden'>
							<Skeleton className='w-full h-full rounded-md' />
						</div>

						<div className='flex flex-col flex-1 overflow-hidden justify-between py-1'>
							<Skeleton className='h-4 w-[90%] mb-2 rounded-md' />
							<Skeleton className='h-3 w-[60%] mb-1 rounded-md' />
							<Skeleton className='h-3 w-[80%] rounded-md' />
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
