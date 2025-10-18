import { useAddCommentReaction } from '@/hooks/comment/useAddCommentReaction'
import { type IVideoComment, ReactionType } from '@/types/comment.types'
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa'

interface IWatchCommentReactions {
	comment: IVideoComment
}

export function WatchCommentReactions({ comment }: IWatchCommentReactions) {
	const { addReaction } = useAddCommentReaction()

	const handleAddCommentReaction = (type: ReactionType) => {
		const reactionData = {
			type,
			commentId: comment.id,
		}
		addReaction(reactionData)
	}
	return (
		<div className='flex gap-5 items-center'>
			<button
				onClick={() => handleAddCommentReaction(ReactionType.LIKE)}
				className={`flex items-center gap-1 py-1 rounded-md transition-colors cursor-pointer group
				${comment.userReaction === ReactionType.LIKE ? 'text-primary font-bold' : 'text-gray-500'}
				`}
			>
				<FaThumbsUp className='w-4 h-4 transition-colors mr-1' />
				<span>{comment.likes}</span>
			</button>

			<button
				onClick={() => handleAddCommentReaction(ReactionType.DISLIKE)}
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
