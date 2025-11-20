'use client'

import { useGetAllComments } from '@/hooks/comment/useGetAllComments'
import type { IVideo } from '@/types/video.types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { WatchCommentItem } from './WatchCommentItem'
import { WatchCommentsHeader } from './WatchCommentsHeader'

interface IWatchCommentsProps {
	video: IVideo
}

export function WatchCommentsList({ video }: IWatchCommentsProps) {
	const { allComments } = useGetAllComments(video.id)

	const searchParams = useSearchParams()
	const commentId = searchParams.get('commentId')

	const [expandedReplies, setExpandedReplies] = useState<
		Record<string, boolean>
	>({})

	const toggleReplies = (id: string) =>
		setExpandedReplies((prev) => ({ ...prev, [id]: !prev[id] }))

	const commentTree = useMemo(() => {
		if (!allComments?.data) return []

		const sorted = [...allComments.data].sort(
			(a, b) => new Date(a.createdAt) - new Date(b.createdAt),
		)

		const map: Record<string, any> = {}
		sorted.forEach((c) => (map[c.id] = { ...c, replies: [] }))

		const roots = sorted.filter((c) => !c.parentId).map((c) => map[c.id])

		const findRoot = (item: any) => {
			while (item.parentId) {
				item = map[item.parentId]
			}
			return item
		}

		sorted.forEach((c) => {
			if (c.parentId) {
				const realRoot = findRoot(c)
				if (realRoot.id !== c.id) {
					realRoot.replies.push(map[c.id])
				}
			}
		})

		return roots
	}, [allComments?.data])

	const getRootId = (id: string | null) => {
		if (!id || !allComments?.data) return null

		const raw = allComments.data
		let current = raw.find((c) => c.id === id)
		if (!current) return null

		while (current.parentId) {
			current = raw.find((c) => c.id === current.parentId)!
			if (!current) return null
		}

		return current.id
	}

	useEffect(() => {
		if (!commentId) return

		const rootId = getRootId(commentId)
		if (!rootId) return

		setExpandedReplies((prev) => ({
			...prev,
			[rootId]: true,
		}))
	}, [commentId, allComments?.data])

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
	}, [commentId, expandedReplies])

	return (
		<div className='mt-8'>
			<WatchCommentsHeader video={video} allComments={allComments} />

			<div className='flex flex-col gap-5'>
				{commentTree.map((comment) => (
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
		</div>
	)
}
