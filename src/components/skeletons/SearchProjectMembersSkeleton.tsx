import { Skeleton } from '../ui/skeleton'

export function SearchProjectMembersSkeleton() {
	return (
		<div className='flex items-center gap-3 py-1'>
			<Skeleton className='h-[32px] w-[32px]  bg-neutral-800 rounded-full' />
			<div className='flex flex-col gap-2'>
				<Skeleton className='h-[16px] w-[150px]  bg-neutral-800' />
				<Skeleton className='h-[14px] w-[77px]  bg-neutral-800' />
			</div>
		</div>
	)
}
