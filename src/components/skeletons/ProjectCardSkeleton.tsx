import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '../ui/card'

export function ProjectCardSkeleton() {
	return (
		<Card className='px-7 gap-1 min-h-[450px] border rounded-md animate-pulse pt-10 flex flex-col'>
			<div className='flex-grow flex flex-col'>
				<Skeleton className='h-6 w-3/4 mb-3 rounded-md' /> {/* Заголовок */}
				<Skeleton className='h-4 w-full mb-4 rounded-md' /> {/* Опис */}
				<div className='flex justify-between mb-5'>
					<Skeleton className='h-6 w-20 rounded-md' /> {/* Badge */}
					<Skeleton className='h-6 w-10 rounded-md' /> {/* Progress % */}
				</div>
				<Skeleton className='h-3 w-full mb-5 rounded-md' />{' '}
				{/* Progress bar placeholder */}
				<div className='flex justify-between mb-3'>
					<Skeleton className='h-5 w-16 rounded-md' /> {/* Calendar */}
					<Skeleton className='h-5 w-16 rounded-md' /> {/* Team */}
				</div>
			</div>
			<div className='mt-10 flex justify-between items-end pb-5'>
				<Skeleton className='h-6 w-20 rounded-md' /> {/* Detail text */}
				<Skeleton className='h-10 w-24 rounded-md' /> {/* Button placeholder */}
			</div>
		</Card>
	)
}
