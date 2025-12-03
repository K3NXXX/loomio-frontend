'use client'

import { ReportDetailsModal } from '@/components/admin/report-comment-modal-details/ReportCommentDetailsModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useGetCommentHistory } from '@/hooks/report/useGetCommentHistory'
import { cn } from '@/lib/utils'
import { truncateName } from '@/utils/truncateName'
import { useState } from 'react'

const formatReason = (reason: string) => {
	return reason
		.toLowerCase()
		.replace(/_/g, ' ')
		.replace(/^\w/, (c) => c.toUpperCase())
}

const formatStatus = (status: string) => {
	return status
		.toLowerCase()
		.replace(/_/g, ' ')
		.replace(/^\w/, (c) => c.toUpperCase())
}

export function CommentReportsHistory() {
	const { commentHistory, isLoading } = useGetCommentHistory()

	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const openModal = (id: string) => {
		setSelectedId(id)
		setIsModalOpen(true)
	}

	if (isLoading) {
		return (
			<div className='p-10 text-muted-foreground text-center'>
				Loading comment reports...
			</div>
		)
	}

	if (!commentHistory?.length) {
		return (
			<div className='p-10 text-muted-foreground text-center'>
				No reports for comments.
			</div>
		)
	}

	const gridCols =
		'[grid-template-columns:20px_minmax(350px,1fr)_170px_170px_170px_130px_120px_150px]'

	const renderUser = (user: any) => (
		<div className='flex flex-col items-center gap-1'>
			<Avatar className='w-9 h-9 shadow-sm'>
				<AvatarImage src={user?.avatarUrl || ''} alt={user?.username} />
				<AvatarFallback className='text-xs bg-muted/40'>
					{user?.username?.[0]?.toUpperCase() || 'U'}
				</AvatarFallback>
			</Avatar>

			<div className='text-xs text-muted-foreground/90 font-medium truncate max-w-[140px]'>
				@{user?.username || 'unknown'}
			</div>
		</div>
	)

	const renderDeletedUser = () => (
		<div className='flex flex-col items-center gap-1 opacity-60'>
			<Avatar className='w-9 h-9 shadow-sm'>
				<AvatarFallback className='text-xs bg-muted/40'>X</AvatarFallback>
			</Avatar>

			<div className='text-xs text-muted-foreground/70 font-medium truncate max-w-[140px]'>
				deleted
			</div>
		</div>
	)

	const renderHeader = () => (
		<div
			className={cn(
				'sticky top-0 z-10 bg-background/90 backdrop-blur-md',
				'border-b border-border/40 rounded-t-xl shadow-sm',
				'px-5 py-3',
				'grid items-center gap-4 text-[11px] tracking-wide font-semibold uppercase text-muted-foreground',
				gridCols,
			)}
		>
			<div />
			<div>Comment</div>
			<div className='text-center'>Comment author</div>
			<div className='text-center'>Reporter</div>
			<div className='text-center'>Resolved by</div>
			<div className='text-center'>Reason</div>
			<div className='text-center'>Status</div>
			<div className='text-center'>Date</div>
		</div>
	)

	const renderRow = (r: any) => (
		<div
			key={r.id}
			onClick={() => openModal(r.id)}
			className={cn(
				'cursor-pointer group grid items-center gap-4',
				'rounded-xl border border-border/40 bg-background',
				'px-5 py-4 transition-all duration-150',
				'hover:bg-muted/10 hover:shadow-sm',
				'active:scale-[0.99]',
				gridCols,
			)}
		>
			<div />

			{/* COMMENT */}
			<div className='flex items-start min-w-0'>
				<div className='min-w-0 space-y-1'>
					<div className='font-medium text-[15px] leading-[1.45] text-foreground/90'>
						{r.comment ? (
							truncateName(r.comment.content, 40)
						) : (
							<span className='text-red-500'>Deleted comment</span>
						)}
					</div>

					{r.message && (
						<div className='text-[12px] leading-[1.4] text-muted-foreground/90 pl-[2px] border-l border-border/30 ml-[2px]'>
							<span className='font-medium text-foreground/70'>Note:</span>{' '}
							{truncateName(r.message, 75)}
						</div>
					)}
				</div>
			</div>

			{/* COMMENT AUTHOR */}
			<div className='text-center'>
				{r.comment ? renderUser(r.comment.user) : renderDeletedUser()}
			</div>

			{/* REPORTER */}
			<div className='text-center'>{renderUser(r.author)}</div>

			{/* RESOLVED BY */}
			<div className='text-center'>
				{r.assignedTo ? (
					<div className='text-xs text-emerald-500 font-medium'>
						@{r.assignedTo.username}
					</div>
				) : (
					<div className='text-xs text-muted-foreground'>Unassigned</div>
				)}
			</div>

			{/* REASON */}
			<div className='text-center'>
				<Badge
					variant='outline'
					className='rounded-full px-3 py-0.5 text-[11px] tracking-wide font-medium border-[1.5px]'
				>
					{formatReason(r.reason)}
				</Badge>
			</div>

			{/* STATUS */}
			<div className='text-center text-[12px] font-medium'>
				<span
					className={cn(
						'px-2 py-0.5 rounded-md',
						r.status === 'PENDING' && 'text-yellow-400',
						r.status === 'IN_PROGRESS' && 'text-blue-400',
						r.status === 'RESOLVED' && 'text-emerald-400',
						r.status === 'REJECTED' && 'text-red-400',
					)}
				>
					{formatStatus(r.status)}
				</span>
			</div>

			{/* DATE */}
			<div className='text-center text-[12px] text-muted-foreground/80'>
				{new Date(r.createdAt).toLocaleString('en-GB')}
			</div>
		</div>
	)

	return (
		<div className='p-10 flex flex-col items-start w-full'>
			<h1 className='text-[26px] font-bold mb-8 tracking-tight w-full'>
				Comment Reports History
			</h1>

			<div className='relative w-full space-y-4'>
				{renderHeader()}
				<div className='space-y-3 pt-3'>
					{commentHistory
						.filter((r) => r.status === 'RESOLVED')
						.map((r) => renderRow(r))}
				</div>
			</div>

			<ReportDetailsModal
				id={selectedId}
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	)
}
