'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function FollowingsSkeleton() {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className='rounded-2xl border border-neutral-800 p-5 flex items-center gap-4 bg-neutral-900/50'
				>
					<Skeleton className='w-14 h-14 rounded-full' />
					<div className='flex-1 space-y-2'>
						<Skeleton className='h-4 w-1/2' />
						<Skeleton className='h-3 w-1/3' />
					</div>
				</div>
			))}
		</div>
	)
}
