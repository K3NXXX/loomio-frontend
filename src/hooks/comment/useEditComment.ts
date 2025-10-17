import { commentService } from '@/services/comment.service'
import type { IEditCommentResponse } from '@/types/comment.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useEditComment = () => {
	const queryClient = useQueryClient()
	const { mutate: editComment } = useMutation({
		mutationKey: ['editComment'],
		mutationFn: (data: IEditCommentResponse) =>
			commentService.editComment(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getAllComments'] })
		},
		onError: () => {
			toast.error('Something went wrong. Try later')
		},
	})

	return { editComment }
}
