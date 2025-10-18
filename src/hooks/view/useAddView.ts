import { viewService } from '@/services/view.service'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useAddView = () => {
	const { mutate: addView } = useMutation({
		mutationKey: ['addView'],
		mutationFn: (videoId: string) => viewService.addView(videoId),

		onError: () => {
			toast.error('Something went wrong. Try later')
		},
	})

	return { addView }
}
