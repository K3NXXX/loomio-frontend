'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface VideoSkeletonProps {
	width?: number
	height?: number
}

export function UserChannelsSkeleton({
	width = 375,
	height = 100,
}: VideoSkeletonProps) {
	return (
		<div className='w-full flex justify-center'>
			<Skeleton
				className='rounded-lg'
				style={{ width: `${width}px`, height: `${height}px` }}
			/>
		</div>
	)
}
