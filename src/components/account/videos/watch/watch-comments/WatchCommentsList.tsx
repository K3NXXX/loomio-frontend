'use client'

import { useGetAllComments } from '@/hooks/comment/useGetAllComments'
import type { IVideo } from '@/types/video.types'
import { useMemo, useState } from 'react'
import { WatchCommentItem } from './WatchCommentItem'
import { WatchCommentsHeader } from './WatchCommentsHeader'

interface IWatchCommentsProps {
	video: IVideo
}

export function WatchCommentsList({ video }: IWatchCommentsProps) {
	const { allComments } = useGetAllComments(video.id)

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

		// map for quick access
		const map = {}
		sorted.forEach((c) => (map[c.id] = { ...c, replies: [] }))

		// find all roots
		const roots = sorted.filter((c) => !c.parentId).map((c) => map[c.id])

		// helper to find real root
		const findRoot = (item) => {
			while (item.parentId) {
				item = map[item.parentId]
			}
			return item
		}

		// flatten all replies to root
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

	console.log('comments', allComments)

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
