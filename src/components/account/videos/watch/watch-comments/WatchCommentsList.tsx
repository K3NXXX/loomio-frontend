'use client'

import { useGetAllComments } from '@/hooks/comment/useGetAllComments'
import type { IVideo } from '@/types/video.types'

import { WatchCommentItem } from './WatchCommentItem'
import { WatchCommentsHeader } from './WatchCommentsHeader'

interface IWatchCommentsProps {
	video: IVideo
}

export function WatchCommentsList({ video }: IWatchCommentsProps) {
	const { allComments } = useGetAllComments(video.id)

	const maxIndentLevel = 3

	// const renderReplies = (
	// 	replies: Comment[],
	// 	level = 1,
	// 	parentUsername?: string,
	// ) => {
	// 	if (!replies || replies.length === 0) return null

	// 	return (
	// 		<div className='flex flex-col gap-3 mt-2'>
	// 			{replies.map((reply) => {
	// 				const indent = level <= maxIndentLevel ? level * 1.5 : 0
	// 				return (
	// 					<div key={reply.id} style={{ marginLeft: `${indent}rem` }}>
	// 						<div className='relative flex flex-col gap-2 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all bg-neutral-900'>
	// 							<div className='absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-primary rounded-tr-xl'></div>

	// 							<div className='flex gap-3 items-start'>
	// 								<img
	// 									src={reply.user.avatarUrl}
	// 									alt={reply.user.username}
	// 									className='w-9 h-9 rounded-full object-cover ring-1 ring-neutral-900'
	// 								/>
	// 								<div className='flex-1'>
	// 									<div className='flex items-center gap-2'>
	// 										<p className='font-medium text-sm text-neutral-100'>
	// 											@{reply.user.username}
	// 										</p>
	// 										<p className='text-xs text-neutral-400'>
	// 											{new Date(reply.createdAt).toLocaleDateString()}
	// 										</p>
	// 									</div>

	// 									{parentUsername && (
	// 										<p className='text-xs text-neutral-500'>
	// 											Replying to @{parentUsername}
	// 										</p>
	// 									)}

	// 									<p className='text-[15px] mt-1 text-neutral-200 leading-relaxed'>
	// 										{reply.content}
	// 									</p>

	// 									<div className='flex items-center gap-4 mt-2 text-sm text-neutral-400'>
	// 										<button className='flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer'>
	// 											<FaThumbsUp className='w-4 h-4' /> Like
	// 										</button>
	// 										<button
	// 											className='flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer'
	// 											onClick={() => toggleReplyInput(reply.id)}
	// 										>
	// 											<FaReply className='w-4 h-4 rotate-180' /> Reply
	// 										</button>
	// 									</div>

	// 									{replyInputs[reply.id] && (
	// 										<div className='mt-2 flex flex-col gap-2'>
	// 											<textarea
	// 												className='w-full p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-sm resize-none focus:ring-2 focus:ring-primary outline-none transition'
	// 												rows={2}
	// 												placeholder='Write a reply...'
	// 											/>
	// 											<div className='flex gap-2 justify-end'>
	// 												<button className='px-3 py-1 bg-primary text-white rounded-lg hover:brightness-90 transition cursor-pointer text-sm'>
	// 													Reply
	// 												</button>
	// 												<button
	// 													className='px-3 py-1 bg-neutral-700 text-white rounded-lg hover:brightness-90 transition cursor-pointer text-sm'
	// 													onClick={() => cancelReplyInput(reply.id)}
	// 												>
	// 													Cancel
	// 												</button>
	// 											</div>
	// 										</div>
	// 									)}
	// 								</div>
	// 							</div>

	// 							{reply.replies && reply.replies.length > 0 && (
	// 								<button
	// 									onClick={() => toggleReplies(reply.id)}
	// 									className='mt-2 text-xs font-medium text-neutral-400 flex items-center gap-1 hover:text-primary transition-colors cursor-pointer'
	// 								>
	// 									{expandedReplies[reply.id] ? (
	// 										<FaChevronDown className='w-3 h-3' />
	// 									) : (
	// 										<FaChevronRight className='w-3 h-3' />
	// 									)}
	// 									<span>
	// 										{reply.replies.length}{' '}
	// 										{reply.replies.length === 1 ? 'reply' : 'replies'}
	// 									</span>
	// 								</button>
	// 							)}
	// 						</div>

	// 						{expandedReplies[reply.id] &&
	// 							renderReplies(reply.replies!, level + 1, reply.user.username)}
	// 					</div>
	// 				)
	// 			})}
	// 		</div>
	// 	)
	// }

	return (
		<div className='mt-8'>
			<WatchCommentsHeader video={video} allComments={allComments} />

			<div className='flex flex-col gap-5'>
				{allComments?.data.map((comment) => (
					<WatchCommentItem key={comment.id} comment={comment} />
				))}
			</div>
		</div>
	)
}
