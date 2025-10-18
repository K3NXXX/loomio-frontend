import type { IVideoComment } from '@/types/comment.types'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Button } from '@/components/ui/button'
import { useEditComment } from '@/hooks/comment/useEditComment'
import { getInitials } from '@/utils/get-initials'
import { useState } from 'react'
import { FaChevronDown, FaChevronRight, FaReply } from 'react-icons/fa'
import { WatchCommentOptions } from './WatchCommentOptions'
import { WatchCommentReactions } from './WatchCommentReactions'
import { WatchCommentReplyInput } from './WatchCommentReplyInput'

interface IWatchCommentItemProps {
	comment: IVideoComment
	videoId: string
	toggleReplies: (id: string) => void
	isExpanded: boolean
}

export function WatchCommentItem({
	comment,
	videoId,
	toggleReplies,
	isExpanded,
}: IWatchCommentItemProps) {
	const [replyInput, setReplyInput] = useState<string | null>(null)

	const [isCommentEditing, setIsCommentEditing] = useState(false)
	const [editingText, setEditingText] = useState(comment.content)
	const { editComment } = useEditComment()

	const handleEditComment = () => {
		const commentData = {
			content: editingText,
			commentId: comment.id,
		}
		editComment(commentData)
		setIsCommentEditing(false)
	}

	const toggleReplyInput = (id: string) =>
		setReplyInput((prev) => (prev === id ? null : id))

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
									{comment.parent && comment.parent.user && (
										<p className='text-xs text-primary text-[14px] flex  gap-1 items-center font-bold cursor-pointer'>
											<FaReply className='rotate-180 inline-block' />@
											{comment.parent.user.username}
										</p>
									)}
								</div>
								<p className='text-[15px] max-w-[1000px] mt-1 text-neutral-200 leading-relaxed break-words'>
									{comment.content}
								</p>
								<div className='flex items-center gap-8 mt-2 text-sm text-neutral-400'>
									<WatchCommentReactions comment={comment} />

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
								<WatchCommentReplyInput
									comment={comment}
									replyInput={replyInput}
									setReplyInput={setReplyInput}
									videoId={videoId}
								/>
								{!comment.parentId && comment._count.replies > 0 && (
									<div className='flex flex-col gap-2 pt-2'>
										<button
											onClick={() => toggleReplies(comment.id)}
											className='text-xs font-medium text-neutral-400 flex items-center gap-1 hover:text-primary transition-colors cursor-pointer'
										>
											{isExpanded ? <FaChevronDown /> : <FaChevronRight />}
											<span>
												{comment._count.replies}{' '}
												{comment._count.replies === 1 ? 'reply' : 'replies'}
											</span>
										</button>
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
			</div>
		</div>
	)
}
