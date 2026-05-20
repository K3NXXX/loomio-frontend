import { commentService } from '@/services/comment.service'
import type { ICreateCommentRequest } from '@/types/comment.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useCreateComment = (videoId: string) => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')
	const { mutate: createComment } = useMutation({
		mutationKey: ['createComment'],
		mutationFn: (data: ICreateCommentRequest) =>
			commentService.createComment(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['getAllComments', videoId],
			})
		},
		onError: () => {
			toast.error(t('genericErrorLater'))
		},
	})

	return { createComment }
}
