import { commentService } from '@/services/comment.service'
import type { IAddCommentReactionRequest } from '@/types/comment.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useAddCommentReaction = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')
	const { mutate: addReaction } = useMutation({
		mutationKey: ['addReaction'],
		mutationFn: (data: IAddCommentReactionRequest) =>
			commentService.addCommentReaction(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getAllComments'] })
		},
		onError: () => {
			toast.error(t('genericErrorLater'))
		},
	})

	return { addReaction }
}
