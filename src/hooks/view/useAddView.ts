import { viewService } from '@/services/view.service'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useAddView = () => {
	const t = useTranslations('toast')
	const { mutate: addView } = useMutation({
		mutationKey: ['addView'],
		mutationFn: (videoId: string) => viewService.addView(videoId),

		onError: () => {
			toast.error(t('genericErrorLater'))
		},
	})

	return { addView }
}
