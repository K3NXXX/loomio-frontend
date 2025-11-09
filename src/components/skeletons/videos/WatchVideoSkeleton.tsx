'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function WatchVideoSkeleton() {
	return (
		<Skeleton
			className='rounded-xl'
			style={{ width: '1255px', height: '706px' }}
		/>
	)
}
