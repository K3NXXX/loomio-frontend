import { likeService } from '@/services/like.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useToggleVideoDislike = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')
	const { mutate: toggleVideoDislike } = useMutation({
		mutationKey: ['toggleDislike'],
		mutationFn: (videoId: string) => likeService.toggleVideoDislike(videoId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getOnePublicVideo'] })
			queryClient.invalidateQueries({ queryKey: ['hasVideoDisliked'] })
			queryClient.invalidateQueries({ queryKey: ['hasVideoLiked'] })
		},
		onError: () => {
			toast.error(t('genericErrorLater'))
		},
	})

	return { toggleVideoDislike }
}
