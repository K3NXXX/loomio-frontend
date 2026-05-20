import { likeService } from '@/services/like.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useToggleVideoLike = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')
	const { mutate: toggleVideoLike } = useMutation({
		mutationKey: ['toggleLike'],
		mutationFn: (videoId: string) => likeService.toggleVideoLike(videoId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getOnePublicVideo'] })
			queryClient.invalidateQueries({ queryKey: ['hasVideoLiked'] })
			queryClient.invalidateQueries({ queryKey: ['hasVideoDisliked'] })
		},
		onError: () => {
			toast.error(t('genericErrorLater'))
		},
	})

	return { toggleVideoLike }
}
