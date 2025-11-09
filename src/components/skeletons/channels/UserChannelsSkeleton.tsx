'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface UserChannelsSkeletonProps {
	width?: number
	height?: number
	count?: number
}

export function UserChannelsSkeleton({
	width = 375,
	height = 100,
	count = 6,
}: UserChannelsSkeletonProps) {
	return (
		<div className='grid grid-cols-3 gap-4 w-full place-items-center'>
			{Array.from({ length: count }).map((_, i) => (
				<Skeleton
					key={i}
					className='rounded-xl'
					style={{ width: `${width}px`, height: `${height}px` }}
				/>
			))}
		</div>
	)
}
