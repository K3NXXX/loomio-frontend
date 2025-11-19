import { commentService } from '@/services/comment.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useDeleteComment = (videoId: string) => {
	const queryClient = useQueryClient()
	const { mutate: deleteComment } = useMutation({
		mutationKey: ['deleteComment'],
		mutationFn: (commentId: string) => commentService.deleteComment(commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getAllComments', videoId] })
		},
		onError: () => {
			toast.error('Something went wrong. Try later')
		},
	})

	return { deleteComment }
}
