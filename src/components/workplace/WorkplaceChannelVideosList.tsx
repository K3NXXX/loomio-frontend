'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { IVideo } from '@/types/video.types'
import { truncateName } from '@/utils/truncateName'
import Image from 'next/image'
import { FaEllipsisV, FaPen } from 'react-icons/fa'

interface IWorkplaceChannelVideosListProps {
	videos: IVideo[]
}
export function WorkplaceChannelVideosList({
	videos,
}: IWorkplaceChannelVideosListProps) {
	if (!videos.length) {
		return (
			<div className='text-muted-foreground text-center py-10'>
				No videos uploaded yet.
			</div>
		)
	}

	console.log('vide', videos)

	const gridCols =
		'[grid-template-columns:20px_minmax(340px,1fr)_110px_150px_110px_80px_100px_120px]'

	return (
		<div className='relative w-full'>
			<div
				className={cn(
					'sticky top-0 z-10 bg-background/85 backdrop-blur-md',
					'border-b border-border/40 rounded-t-xl',
					'px-3 py-2',
					'grid items-center gap-4 text-[11px] font-medium uppercase text-muted-foreground',
					gridCols,
				)}
			>
				<div /> {/* checkbox slot (опційно) */}
				<div>Video</div>
				<div className='text-center'>Visibility</div>
				<div className='text-center'>Restrictions</div>
				<div className='text-center'>Date</div>
				<div className='text-center'>Views</div>
				<div className='text-center'>Comments</div>
				<div /> {/* Actions */}
			</div>

			{/* List */}
			<div className='space-y-3 pt-3'>
				{videos.map((v) => (
					<div
						key={v.id}
						className={cn(
							'grid items-center gap-4',
							'rounded-xl border border-border/40 bg-background/60',
							'px-3 py-3 hover:bg-muted/10 transition-colors',
							gridCols,
						)}
					>
						<div />
						<div className='flex items-center gap-4 min-w-0'>
							<div className='relative w-[120px] h-[68px] overflow-hidden rounded-lg border border-border/30 bg-muted/20 shrink-0'>
								{v.thumbnailFile ? (
									<Image
										src={v.thumbnailFile}
										alt={v.title}
										fill
										sizes='120px'
										className='object-cover'
									/>
								) : (
									<div className='grid place-items-center h-full w-full text-xs text-muted-foreground'>
										No thumbnail
									</div>
								)}
							</div>
							<div className='min-w-0'>
								<div className='font-medium truncate'>{v.title}</div>
								<div className='text-xs text-muted-foreground truncate'>
									{truncateName(v.description, 40) || 'Add a description'}
								</div>
							</div>
						</div>
						{/* visibility */}
						<div className='text-center'>
							<Badge
								variant='outline'
								className={cn(
									'rounded-full px-2.5 py-0.5 text-[11px]',
									v.visibility === 'public' &&
										'border-emerald-400/50 text-emerald-400',
									v.visibility === 'unlisted' &&
										'border-amber-400/50 text-amber-400',
									v.visibility === 'private' &&
										'border-slate-400/50 text-slate-300',
								)}
							>
								{v.visibility}
							</Badge>
						</div>
						{/* restrictions placeholder */}
						<div className='text-center text-muted-foreground'>
							{v.audience === 'yes' ? 'For children' : 'Age restrictions'}
						</div>
						{/* date */}
						<div className='text-center'>
							{new Date(v.createdAt).toLocaleDateString()}
						</div>
						{/* views */}
						<div className='text-center'>{v._count?.views ?? 0}</div>
						{/* comments */}
						<div className='text-center'>{v._count?.comments ?? 0}</div>
						{/* actions */}
						<div className='justify-self-end w-[120px] flex items-center gap-2'>
							<Button
								size='sm'
								variant='outline'
								className='rounded-full px-3 py-1 text-xs whitespace-nowrap'
							>
								<FaPen className='mr-2 h-3.5 w-3.5' /> Edit
							</Button>
							<Button size='icon' variant='ghost' className='rounded-full'>
								<FaEllipsisV className='h-4 w-4 opacity-70' />
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
