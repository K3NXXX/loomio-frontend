import { Button } from '@/components/ui/button'
import { useCreateComment } from '@/hooks/comment/useCreateComment'
import type { IVideoComment } from '@/types/comment.types'
import { useTranslations } from 'next-intl'
import { useState, type Dispatch } from 'react'

interface IWatchCommentRepliesProps {
	comment: IVideoComment
	replyInput: string | null
	setReplyInput: Dispatch<React.SetStateAction<string | null>>
	videoId: string
}

export function WatchCommentReplyInput({
	comment,
	replyInput,
	setReplyInput,
	videoId,
}: IWatchCommentRepliesProps) {
	const t = useTranslations()
	const [replyContent, setReplyContent] = useState('')
	const { createComment } = useCreateComment(videoId)

	const handleAddReply = () => {
		createComment({ content: replyContent, parentId: comment.id, videoId })
		setReplyInput(null)
	}

	return (
		<div className='flex flex-col gap-2 mt-2'>
			{replyInput === comment.id && (
				<div className='flex flex-col gap-2'>
					<textarea
						value={replyContent}
						onChange={(e) => {
							const textarea = e.target
							textarea.style.height = 'auto'
							textarea.style.height = textarea.scrollHeight + 'px'
							setReplyContent(textarea.value)
						}}
						className='w-full bg-transparent border-b border-neutral-600 focus:border-primary focus:outline-none text-xs min-[400px]:text-sm text-neutral-100 placeholder:text-neutral-500 resize-none px-0 py-2 overflow-hidden'
						rows={1}
						placeholder={t('watchComments.writeReply')}
					/>
					<div className='flex gap-1.5 justify-end'>
						<Button
							onClick={() => setReplyInput(null)}
							className='bg-neutral-700 text-xs px-2.5 h-7 rounded-lg'
						>
							{t('watchComments.cancel')}
						</Button>
						<Button
							onClick={handleAddReply}
							className='bg-primary text-xs px-2.5 h-7 rounded-lg'
						>
							{t('watchComments.reply')}
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
