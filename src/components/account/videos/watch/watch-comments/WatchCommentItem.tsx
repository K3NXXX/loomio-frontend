import type { IVideoComment } from '@/types/comment.types'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Button } from '@/components/ui/button'
import { useEditComment } from '@/hooks/comment/useEditComment'
import { getInitials } from '@/utils/get-initials'
import { useState } from 'react'
import { FaReply, FaThumbsUp } from 'react-icons/fa'
import { WatchCommentOptions } from './WatchCommentOptions'

interface IWatchCommentItem {
	comment: IVideoComment
}

export function WatchCommentItem({ comment }: IWatchCommentItem) {
	const [replyInputs, setReplyInputs] = useState<Record<string, boolean>>({})

	const [isCommentEditing, setIsCommentEditing] = useState(false)
	const [editingText, setEditingText] = useState(comment.content)
	const { editComment } = useEditComment()

	const [expandedReplies, setExpandedReplies] = useState<
		Record<string, boolean>
	>({})

	const handleEditComment = () => {
		const commentData = {
			content: editingText,
			commentId: comment.id,
		}
		editComment(commentData)
		setIsCommentEditing(false)
	}

	const toggleReplies = (id: string) =>
		setExpandedReplies((prev) => ({ ...prev, [id]: !prev[id] }))
	const toggleReplyInput = (id: string) =>
		setReplyInputs((prev) => ({ ...prev, [id]: !prev[id] }))
	const cancelReplyInput = (id: string) =>
		setReplyInputs((prev) => ({ ...prev, [id]: false }))

	return (
		<div key={comment.id}>
			<div className='relative flex flex-col gap-2 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all bg-neutral-900'>
				<div className='absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-primary rounded-tr-xl'></div>

				<div className='flex gap-3 justify-between items-center'>
					<div className='flex gap-3 items-start'>
						<Avatar className='w-11 h-11 ring-1 ring-neutral-900'>
							<AvatarImage
								src={comment.user.avatarUrl || undefined}
								alt={comment.user.username}
							/>
							<AvatarFallback>
								{getInitials(comment.user.username)}
							</AvatarFallback>
						</Avatar>
						{isCommentEditing ? (
							<div className='flex flex-col gap-2 w-[1000px] pt-4'>
								<textarea
									value={editingText}
									onChange={(e) => {
										const textarea = e.target
										textarea.style.height = 'auto'
										textarea.style.height = textarea.scrollHeight + 'px'
										setEditingText(textarea.value)
									}}
									className='w-full bg-transparent border-b border-neutral-600 focus:border-primary focus:outline-none text-sm text-neutral-100 placeholder:text-neutral-500 transition-colors resize-none overflow-hidden px-0 py-1'
									placeholder='Edit your comment...'
									rows={1}
								/>

								<div className='flex gap-2 justify-end'>
									<Button
										onClick={() => setIsCommentEditing(false)}
										className='px-3 py-1 bg-neutral-700 text-white rounded-lg hover:brightness-90 transition cursor-pointer text-sm'
									>
										Cancel
									</Button>
									<Button
										onClick={() => handleEditComment()}
										className='px-3 py-1 bg-primary text-white rounded-lg hover:brightness-90 transition cursor-pointer text-sm'
									>
										Save
									</Button>
								</div>
							</div>
						) : (
							<div className='flex-1'>
								<div className='flex items-center gap-2'>
									<p className='font-semibold text-sm text-neutral-100'>
										@{comment.user.username}
									</p>
									<p className='text-xs text-neutral-400'>
										{new Date(comment.createdAt).toLocaleDateString()}
									</p>
								</div>

								<p className='text-[15px] max-w-[1000px] mt-1 text-neutral-200 leading-relaxed break-words'>
									{comment.content}
								</p>

								<div className='flex items-center gap-8 mt-2 text-sm text-neutral-400'>
									<button className='flex items-center gap-1 py-1 rounded-md transition-colors cursor-pointer group'>
										<FaThumbsUp className='w-4 h-4 transition-colors group-hover:text-primary' />
										<span className='transition-colors group-hover:text-primary'>
											Like
										</span>
									</button>

									<button
										className='flex items-center gap-1 py-1 rounded-md transition-colors cursor-pointer group'
										onClick={() => toggleReplyInput(comment.id)}
									>
										<FaReply className='w-4 h-4 rotate-180 transition-colors group-hover:text-primary' />
										<span className='transition-colors group-hover:text-primary'>
											Reply
										</span>
									</button>
								</div>

								{replyInputs[comment.id] && (
									<div className='mt-2 flex flex-col gap-2'>
										<textarea
											className='w-full p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-sm resize-none focus:ring-2 focus:ring-primary outline-none transition'
											rows={2}
											placeholder='Write a reply...'
										/>
										<div className='flex gap-2 justify-end'>
											<button className='px-3 py-1 bg-primary text-white rounded-lg hover:brightness-90 transition cursor-pointer text-sm'>
												Reply
											</button>
											<button
												className='px-3 py-1 bg-neutral-700 text-white rounded-lg hover:brightness-90 transition cursor-pointer text-sm'
												onClick={() => cancelReplyInput(comment.id)}
											>
												Cancel
											</button>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
					<WatchCommentOptions
						comment={comment}
						setIsCommentEditing={setIsCommentEditing}
					/>
				</div>

				{/* {comment.replies && comment.replies.length > 0 && (
					<button
						onClick={() => toggleReplies(comment.id)}
						className='mt-2 text-xs font-medium text-neutral-400 flex items-center gap-1 hover:text-primary transition-colors cursor-pointer'
					>
						{expandedReplies[comment.id] ? (
							<FaChevronDown className='w-3 h-3' />
						) : (
							<FaChevronRight className='w-3 h-3' />
						)}
						<span>
							{comment.replies.length}{' '}
							{comment.replies.length === 1 ? 'reply' : 'replies'}
						</span>
					</button>
				)} */}
			</div>
			{/*
						{expandedReplies[comment.id] &&
							renderReplies(comment.replies!, 1, comment.user.username)} */}
		</div>
	)
}
