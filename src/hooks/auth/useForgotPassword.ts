import { authService } from '@/services/auth.service'
import { IForgotPasswordApiData } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useForgotPassword = (setStep: (step: number) => void) => {
	const { mutate: forgotPassword, isPending: loading } = useMutation({
		mutationKey: ['forgotPassword'],
		mutationFn: (data: IForgotPasswordApiData) =>
			authService.forgotPassword(data),
		onSuccess: () => {
			setStep(2)
		},
		onError: () => {
			toast('Something went wrong. Try again')
		},
	})
	return { forgotPassword, loading }
}
