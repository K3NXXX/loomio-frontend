'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function FollowingsSkeleton() {
	return (
		<ul className='flex flex-col gap-3'>
			{Array.from({ length: 6 }).map((_, i) => (
				<li
					key={i}
					className='flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm'
				>
					<Skeleton className='size-16 shrink-0 rounded-full sm:size-[4.5rem]' />
					<div className='flex min-w-0 flex-1 flex-col justify-center gap-2'>
						<Skeleton className='h-5 w-[55%] sm:h-6' />
						<Skeleton className='h-4 w-[35%]' />
						<Skeleton className='h-3 w-[45%]' />
						<Skeleton className='mt-1 h-10 w-full' />
					</div>
				</li>
			))}
		</ul>
	)
}
