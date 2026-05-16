'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function WorkplaceHeaderSkeleton() {
	return (
		<div className='sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='mx-auto flex h-12 min-[400px]:h-14 w-full items-center justify-between gap-2 min-[400px]:gap-3 px-2 min-[400px]:px-3 md:px-6'>
				<div className='flex min-w-0 items-center gap-1.5 min-[400px]:gap-2'>
					<Skeleton className='size-7 min-[400px]:size-8 shrink-0 rounded-full' />
					<Skeleton className='h-4 min-[400px]:h-5 w-[7.5rem] min-[500px]:w-[11rem] rounded-md' />
				</div>

				<div className='flex shrink-0 items-center justify-end gap-2 min-[400px]:gap-3 min-[500px]:gap-5'>
					<Skeleton className='hidden h-9 rounded-full sm:block w-[5.5rem] min-[400px]:w-[6.25rem]' />
					<Skeleton className='size-9 min-[400px]:size-10 rounded-full' />
					<Skeleton className='size-7 min-[400px]:size-8 rounded-full ring-1 ring-border/50' />
				</div>
			</div>
		</div>
	)
}

function NavRowSkeleton({ wide }: { wide?: boolean }) {
	return (
		<div className='relative flex items-center gap-3 rounded-xl px-4 py-3'>
			<Skeleton className='size-[18px] shrink-0 rounded-md' />
			<Skeleton
				className={cn('h-4 rounded-md', wide ? 'w-[9.5rem]' : 'w-[6.5rem]')}
			/>
		</div>
	)
}

function WorkplaceSidebarSkeleton() {
	return (
		<aside
			className='
			sticky top-[73px] h-[calc(100vh-73px)]
			w-64 shrink-0
			border-r border-border/60
			bg-background/95 backdrop-blur
			shadow-[0_8px_20px_-8px_rgb(0_0_0_/0.35)]
			max-[1200px]:hidden
			'
		>
			<div className='flex flex-col items-center px-4 pt-6 pb-4'>
				<Skeleton className='size-[7.5rem] shrink-0 rounded-full' />
				<div className='mt-3 flex w-full flex-col items-center gap-2'>
					<Skeleton className='h-4 w-28 rounded-md' />
					<Skeleton className='h-3.5 w-20 rounded-md' />
				</div>
			</div>

			<nav className='mt-4 space-y-1 px-3' aria-hidden>
				<NavRowSkeleton wide />
				<NavRowSkeleton />
				<NavRowSkeleton wide />
				<NavRowSkeleton />
				<NavRowSkeleton wide />
				<NavRowSkeleton wide />
			</nav>
		</aside>
	)
}

function WorkplaceDashboardMainSkeleton() {
	return (
		<main className='flex-1 min-w-0'>
			<div className='flex flex-col items-start p-4 min-[500px]:p-6 min-[980px]:p-10'>
				<Skeleton className='mb-4 min-[500px]:mb-5 min-[980px]:mb-8 h-6 min-[400px]:h-7 min-[500px]:h-8 min-[980px]:h-[31px] w-[min(100%,16rem)] min-[500px]:w-[20rem] rounded-md' />

				<div className='flex w-full flex-col items-stretch gap-5 min-[980px]:flex-row min-[980px]:gap-10'>
					<div className='flex w-full min-[980px]:h-[320px] min-[980px]:w-[420px] flex-col items-center justify-center rounded-2xl border border-border/40 p-5 min-[500px]:p-6 text-center transition-all'>
						<Skeleton className='mb-2 h-6 min-[500px]:h-7 w-[12rem] min-[500px]:w-[14rem] rounded-md' />
						<div className='mx-auto mb-4 flex max-w-[260px] w-full flex-col gap-2 min-[980px]:mb-6'>
							<Skeleton className='h-3 min-[500px]:h-3.5 w-full rounded-md' />
							<Skeleton className='h-3 min-[500px]:h-3.5 w-[88%] self-center rounded-md' />
						</div>
						<Skeleton className='h-10 w-[min(100%,11rem)] rounded-full' />
					</div>

					<div className='w-full min-[980px]:min-w-[280px] min-[980px]:max-w-[420px] min-[980px]:flex-1 rounded-2xl border border-border/40 bg-background/60 p-4 min-[500px]:p-6 shadow-sm'>
						<div className='mb-4 flex items-center gap-3 min-[500px]:gap-4 min-[980px]:mb-6'>
							<Skeleton className='size-10 min-[500px]:size-14 shrink-0 rounded-full ring-2 ring-border/25' />
							<div className='min-w-0 space-y-2 text-left'>
								<Skeleton className='h-5 min-[500px]:h-6 w-[10rem] min-[500px]:w-[12rem] rounded-md' />
								<Skeleton className='h-3.5 min-[500px]:h-4 w-24 rounded-md' />
							</div>
						</div>

						<div className='flex flex-col gap-2 min-[500px]:gap-3'>
							{[0, 1, 2].map((i) => (
								<div
									key={i}
									className='flex items-center justify-between rounded-lg border border-border/40 bg-muted/10 px-3 py-2.5 min-[500px]:px-5 min-[500px]:py-3'
								>
									<Skeleton className='h-3.5 min-[500px]:h-4 w-24 min-[500px]:w-28 rounded-md' />
									<Skeleton className='h-6 min-[500px]:h-7 w-8 min-[500px]:w-10 rounded-md' />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export function WorkplaceSkeleton() {
	return (
		<div className='flex min-h-[50vh] flex-col'>
			<WorkplaceHeaderSkeleton />
			<div className='flex'>
				<WorkplaceSidebarSkeleton />
				<WorkplaceDashboardMainSkeleton />
			</div>
		</div>
	)
}
