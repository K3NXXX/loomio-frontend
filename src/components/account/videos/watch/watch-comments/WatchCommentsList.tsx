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

	console.log("all", allComments)

	const [expandedReplies, setExpandedReplies] = useState<
		Record<string, boolean>
	>({})

	const toggleReplies = (id: string) =>
		setExpandedReplies((prev) => ({ ...prev, [id]: !prev[id] }))

	const commentTree = useMemo(() => {
		if (!allComments?.data) return []

		const map: Record<string, any> = {}
		const roots: any[] = []

		allComments.data.forEach((c) => (map[c.id] = { ...c, replies: [] }))

		allComments.data.forEach((c) => {
			if (c.parentId) {
				let rootId = c.parentId

				while (map[rootId]?.parentId) {
					rootId = map[rootId].parentId
				}

				map[rootId]?.replies.push(map[c.id])
			} else {
				roots.push(map[c.id])
			}
		})

		return roots
	}, [allComments])

	return (
		<div className='mt-8'>
			<WatchCommentsHeader video={video} allComments={allComments} />

			<div className='flex flex-col gap-5'>
				{commentTree.map((comment) => (
					<div key={comment.id} className='flex flex-col gap-2'>
						<WatchCommentItem
							comment={comment}
							videoId={video.id}
							toggleReplies={toggleReplies}
							isExpanded={!!expandedReplies[comment.id]}
						/>

						{expandedReplies[comment.id] && comment.replies.length > 0 && (
							<div className='flex flex-col gap-2 ml-10 mt-3'>
								{comment.replies.map((reply) => (
									<WatchCommentItem
										key={reply.id}
										comment={reply}
										videoId={video.id}
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
