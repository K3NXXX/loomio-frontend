import { Button } from '@/components/ui/button'
import { useCreateComment } from '@/hooks/comment/useCreateComment'
import type { IVideoCommentsResponse } from '@/types/comment.types'
import type { IVideo } from '@/types/video.types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface IWatchCommentsHeader {
	allComments?: IVideoCommentsResponse
	video: IVideo
}

export function WatchCommentsHeader({
	allComments,
	video,
}: IWatchCommentsHeader) {
	const t = useTranslations()
	const [newCommentContent, setNewCommentContent] = useState('')
	const { createComment } = useCreateComment(video.id)

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
			<h2 className='text-base min-[400px]:text-lg font-semibold mb-3 min-[400px]:mb-5 text-neutral-100'>
				{t('watchComments.header', { count: allComments?.data.length ?? 0 })}
			</h2>

			<div className='mb-5 min-[400px]:mb-7'>
				<textarea
					className='w-full p-2.5 min-[400px]:p-3 rounded-2xl border border-neutral-700 bg-neutral-900 text-xs min-[400px]:text-sm text-neutral-100 resize-none focus:ring-2 focus:ring-primary outline-none transition'
					rows={3}
					placeholder={t('watchComments.addCommentPlaceholder')}
					value={newCommentContent}
					onChange={(e) => setNewCommentContent(e.target.value)}
				/>
				<div className='flex justify-end mt-2'>
					<Button
						className='px-3 min-[400px]:px-4 py-1.5 min-[400px]:py-2 bg-primary text-white rounded-2xl font-semibold hover:brightness-90 transition text-xs min-[400px]:text-sm'
						onClick={addNewComment}
					>
						{t('watchComments.addCommentButton')}
					</Button>
				</div>
			</div>
		</>
	)
}
