import { useAddCommentReaction } from '@/hooks/comment/useAddCommentReaction'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { type IVideoComment, ReactionType } from '@/types/comment.types'
import { useAuthPromptStore } from '@/zustand/store/authPromptStore'
import { useTranslations } from 'next-intl'
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa'

interface IWatchCommentReactions {
	comment: IVideoComment
}

export function WatchCommentReactions({ comment }: IWatchCommentReactions) {
	const t = useTranslations()
	const { userData } = useGetMe()
	const openAuthPrompt = useAuthPromptStore((s) => s.openAuthPrompt)
	const { addReaction } = useAddCommentReaction()

	const handleAddCommentReaction = (type: ReactionType) => {
		if (!userData) return
		const reactionData = {
			type,
			commentId: comment.id,
		}
		addReaction(reactionData)
	}

	if (!userData) {
		return (
			<div className='flex gap-5 items-center text-gray-500 text-sm'>
				<button
					type='button'
					onClick={openAuthPrompt}
					className='flex items-center gap-1 py-1 rounded-md transition-colors cursor-pointer hover:text-primary'
					title={t('watchComments.like')}
				>
					<FaThumbsUp className='w-4 h-4 mr-1 opacity-70' />
					{comment.likes}
				</button>
				<button
					type='button'
					onClick={openAuthPrompt}
					className='flex items-center gap-1 py-1 rounded-md transition-colors cursor-pointer hover:text-primary relative top-[1px]'
					title={t('watchComments.dislike')}
				>
					<FaThumbsDown className='w-4 h-4 mr-1 opacity-70' />
					{comment.dislikes}
				</button>
			</div>
		)
	}

	return (
		<div className='flex gap-5 items-center'>
			<button
				type='button'
				onClick={() => handleAddCommentReaction(ReactionType.LIKE)}
				title={t('watchComments.like')}
				aria-label={t('watchComments.like')}
				className={`flex items-center gap-1 py-1 rounded-md transition-colors cursor-pointer group
				${comment.userReaction === ReactionType.LIKE ? 'text-primary font-bold' : 'text-gray-500'}
				`}
			>
				<FaThumbsUp className='w-4 h-4 transition-colors mr-1' />
				<span>{comment.likes}</span>
			</button>

			<button
				type='button'
				onClick={() => handleAddCommentReaction(ReactionType.DISLIKE)}
				title={t('watchComments.dislike')}
				aria-label={t('watchComments.dislike')}
				className={`flex items-center gap-1 py-1 rounded-md transition-colors cursor-pointer group relative top-[1px]
				${comment.userReaction === ReactionType.DISLIKE ? 'text-primary font-bold' : 'text-gray-500'}
			`}
			>
				<FaThumbsDown className='w-4 h-4 transition-colors mr-1' />
				<span>{comment.dislikes}</span>
			</button>
		</div>
	)
}
