'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function SearchVideoSkeletonList() {
	return (
		<div className='max-w-6xl mx-auto px-4 py-6'>
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className='flex gap-5 rounded-xl p-3 items-start bg-muted/10 animate-pulse'
				>
					<Skeleton className='w-[480px] h-[270px] rounded-xl' />

					<div className='flex flex-1 justify-between gap-3 items-start'>
						<div className='flex flex-col gap-3 w-full'>
							<Skeleton className='h-6 w-[70%] rounded-md' />

							<div className='flex items-center gap-2'>
								<Skeleton className='h-7 w-7 rounded-full' />
								<Skeleton className='h-4 w-[120px] rounded-md' />
							</div>

							<div className='flex items-center gap-2 mt-3'>
								<Skeleton className='h-4 w-[80px] rounded-md' />
								<Skeleton className='h-4 w-[40px] rounded-md' />
								<Skeleton className='h-4 w-[80px] rounded-md' />
							</div>
						</div>

						<Skeleton className='h-6 w-6 rounded-md' />
					</div>
				</div>
			))}
		</div>
	)
}
