'use client'

import { useGetAllComments } from '@/hooks/comment/useGetAllComments'
import type { IVideo } from '@/types/video.types'
import type { IVideoComment } from '@/types/comment.types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { WatchCommentItem } from './WatchCommentItem'
import { WatchCommentsHeader } from './WatchCommentsHeader'
import { Skeleton } from '@/components/ui/skeleton'

interface IWatchCommentsProps {
	video: IVideo
}

function findCommentInRoots(
	roots: IVideoComment[],
	id: string,
): IVideoComment | null {
	for (const root of roots) {
		if (root.id === id) return root
		const reply = root.replies?.find((r) => r.id === id)
		if (reply) return reply
	}
	return null
}

function getRootId(roots: IVideoComment[], id: string | null): string | null {
	if (!id) return null
	const hit = findCommentInRoots(roots, id)
	if (!hit) return null
	return hit.parentId ?? hit.id
}

export function WatchCommentsList({ video }: IWatchCommentsProps) {
	const {
		allComments,
		rootComments,
		total,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useGetAllComments(video.id)

	const searchParams = useSearchParams()
	const commentId = searchParams.get('commentId')
	const sentinelRef = useRef<HTMLDivElement | null>(null)

	const [expandedReplies, setExpandedReplies] = useState<
		Record<string, boolean>
	>({})

	const toggleReplies = (id: string) =>
		setExpandedReplies((prev) => ({ ...prev, [id]: !prev[id] }))

	useEffect(() => {
		const el = sentinelRef.current
		if (!el || !hasNextPage) return

		const observer = new IntersectionObserver(
			(entries) => {
				const first = entries[0]
				if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
					void fetchNextPage()
				}
			},
			{ root: null, rootMargin: '240px 0px', threshold: 0 },
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	useEffect(() => {
		if (!commentId || !hasNextPage || isFetchingNextPage) return
		if (findCommentInRoots(rootComments, commentId)) return
		void fetchNextPage()
	}, [commentId, rootComments, hasNextPage, isFetchingNextPage, fetchNextPage])

	useEffect(() => {
		if (!commentId) return

		const rootId = getRootId(rootComments, commentId)
		if (!rootId) return

		setExpandedReplies((prev) => ({
			...prev,
			[rootId]: true,
		}))
	}, [commentId, rootComments])

	useEffect(() => {
		if (!commentId) return

		let attempts = 0

		const interval = setInterval(() => {
			attempts++

			const wrapper = document.getElementById(`comment-${commentId}`)
			if (!wrapper) {
				if (attempts > 40) clearInterval(interval)
				return
			}

			const inner = wrapper.querySelector('.comment-inner') || wrapper

			inner.scrollIntoView({ behavior: 'smooth', block: 'center' })
			inner.classList.add('highlight-comment')

			clearInterval(interval)
		}, 150)

		return () => clearInterval(interval)
	}, [commentId, expandedReplies, rootComments])

	return (
		<div className='mt-8'>
			<WatchCommentsHeader
				video={video}
				allComments={allComments}
				totalComments={total}
			/>

			<div className='flex flex-col gap-5'>
				{rootComments.map((comment) => (
					<div key={comment.id} className='flex flex-col gap-2'>
						<WatchCommentItem
							comment={comment}
							video={video}
							toggleReplies={toggleReplies}
							isExpanded={!!expandedReplies[comment.id]}
						/>

						{expandedReplies[comment.id] && comment.replies.length > 0 && (
							<div className='flex flex-col gap-2 ml-10 mt-3'>
								{comment.replies.map((reply) => (
									<WatchCommentItem
										key={reply.id}
										comment={reply}
										video={video}
										toggleReplies={toggleReplies}
										isExpanded={!!expandedReplies[reply.id]}
									/>
								))}
							</div>
						)}
					</div>
				))}
			</div>

			<div ref={sentinelRef} className='h-4 w-full shrink-0' aria-hidden />
			{isFetchingNextPage && (
				<div className='flex flex-col gap-4 mt-4'>
					{Array.from({ length: 2 }).map((_, i) => (
						<div key={i} className='flex gap-3'>
							<Skeleton className='h-10 w-10 rounded-full shrink-0' />
							<div className='flex flex-col gap-2 flex-1'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-12 w-full rounded-xl' />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
