import { commentService } from '@/services/comment.service'
import type { ICreateCommentRequest } from '@/types/comment.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateComment = () => {
	const queryClient = useQueryClient()
	const { mutate: createComment } = useMutation({
		mutationKey: ['createComment'],
		mutationFn: (data: ICreateCommentRequest) =>
			commentService.createComment(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getAllComments'] })
		},
		onError: () => {
			toast.error('Something went wrong. Try later')
		},
	})

	return { createComment }
}
