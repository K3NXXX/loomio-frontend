import { commentService } from '@/services/comment.service'
import type { IEditCommentRequest } from '@/types/comment.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useEditComment = (videoId: string) => {
	const queryClient = useQueryClient()
	const { mutate: editComment } = useMutation({
		mutationKey: ['editComment'],
		mutationFn: (data: IEditCommentRequest) => commentService.editComment(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getAllComments', videoId] })
		},
		onError: () => {
			toast.error('Something went wrong. Try later')
		},
	})

	return { editComment }
}
