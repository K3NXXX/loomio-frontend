'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function PlaylistPageSkeleton() {
	return (
		<div className='px-4 py-10'>
			<div className='max-w-[1284px] mx-auto'>
				<div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
					<div className='space-y-3'>
						<Skeleton className='h-8 w-[240px] rounded-md' />
						<Skeleton className='h-4 w-[180px] rounded-md' />
						<Skeleton className='h-3 w-[320px] rounded-md' />
					</div>

					<div className='flex items-center gap-3'>
						<Skeleton className='h-10 w-[150px] rounded-md' />
						<Skeleton className='h-10 w-10 rounded-md' />
					</div>
				</div>

				<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='
								group rounded-2xl border border-border/40
								bg-background/60 shadow-sm
								overflow-hidden
							'
						>
							<Skeleton className='w-full aspect-video' />

							<div className='p-4 space-y-3'>
								<Skeleton className='h-5 w-[70%] rounded-md' />
								<Skeleton className='h-4 w-[50%] rounded-md' />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
