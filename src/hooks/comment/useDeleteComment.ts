import { commentService } from '@/services/comment.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useDeleteComment = (videoId: string) => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')
	const { mutate: deleteComment } = useMutation({
		mutationKey: ['deleteComment'],
		mutationFn: (commentId: string) => commentService.deleteComment(commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getAllComments', videoId] })
		},
		onError: () => {
			toast.error(t('genericErrorLater'))
		},
	})

	return { deleteComment }
}
