'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function WorkplaceSkeleton() {
	return (
		<div className='min-h-[60vh] flex flex-col'>
			<div className='px-6 py-4 border-b border-neutral-800'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<Skeleton className='w-16 h-16 rounded-full' />
						<div className='space-y-2'>
							<Skeleton className='h-4 w-40' />
							<Skeleton className='h-3 w-24' />
						</div>
					</div>
					<Skeleton className='h-10 w-28 rounded-xl' />
				</div>
			</div>

			<div className='flex'>
				<div className='w-[240px] min-h-[calc(100vh-73px)] border-r border-neutral-800 p-5 space-y-5 bg-neutral-900/40'>
					<Skeleton className='h-4 w-32' />
					<Skeleton className='h-4 w-20' />
					<Skeleton className='h-4 w-28' />
					<Skeleton className='h-4 w-24' />
					<Skeleton className='h-4 w-36' />
				</div>

				<div className='flex-1 p-6 space-y-5'>
					<Skeleton className='h-6 w-1/3' />
					<Skeleton className='h-4 w-1/2' />
					<Skeleton className='h-48 w-full rounded-xl' />
				</div>
			</div>
		</div>
	)
}
