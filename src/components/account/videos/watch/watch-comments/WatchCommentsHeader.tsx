import { Button } from '@/components/ui/button'
import { useCreateComment } from '@/hooks/comment/useCreateComment'
import type { IVideoCommentsResponse } from '@/types/comment.types'
import type { IVideo } from '@/types/video.types'
import { useState } from 'react'

interface IWatchCommentsHeader {
	allComments?: IVideoCommentsResponse
	video: IVideo
}

export function WatchCommentsHeader({
	allComments,
	video,
}: IWatchCommentsHeader) {
	const [newCommentContent, setNewCommentContent] = useState('')
	const { createComment } = useCreateComment()

	const addNewComment = () => {
		const newComment = {
			videoId: video.id,
			content: newCommentContent,
		}

		createComment(newComment)
		setNewCommentContent('')
	}

	return (
		<>
			<h2 className='text-lg font-semibold mb-5 text-neutral-100'>
				Comments ({allComments?.data.length})
			</h2>

			<div className='mb-7'>
				<textarea
					className='w-full p-3 rounded-2xl border border-neutral-700 bg-neutral-900 text-sm text-neutral-100 resize-none focus:ring-2 focus:ring-primary outline-none transition'
					rows={3}
					placeholder='Add a comment...'
					value={newCommentContent}
					onChange={(e) => setNewCommentContent(e.target.value)}
				/>
				<div className='flex justify-end mt-2'>
					<Button
						className='px-4 py-2 bg-primary text-white rounded-2xl font-semibold hover:brightness-90 transition text-sm'
						onClick={addNewComment}
					>
						Add Comment
					</Button>
				</div>
			</div>
		</>
	)
}
