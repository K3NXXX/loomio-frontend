import { commentService } from '@/services/comment.service'
import type { IAddCommentReactionRequest } from '@/types/comment.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useAddCommentReaction = () => {
	const queryClient = useQueryClient()
	const { mutate: addReaction } = useMutation({
		mutationKey: ['addReaction'],
		mutationFn: (data: IAddCommentReactionRequest) =>
			commentService.addCommentReaction(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getAllComments'] })
		},
		onError: () => {
			toast.error('Something went wrong. Try later')
		},
	})

	return { addReaction }
}
