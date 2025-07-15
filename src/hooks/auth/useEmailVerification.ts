import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'
import {
	IEmailVerification,
	IEmailVerificationResponse,
} from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useEmailVerification = () => {
	const { push } = useRouter()
	const { mutate: confirmEmail } = useMutation({
		mutationKey: ['emailVerification'],
		mutationFn: (data: IEmailVerification) =>
			authService.emailVerification(data),
		onSuccess: (data: IEmailVerificationResponse) => {
			if (data.user) {
				localStorage.setItem('user', JSON.stringify(data.user))
			}
			toast('Registration completed!')
			push(PAGES.DASHBOARD)
		},
		onError: () => {
			toast('Invalid code. Try again')
		},
	})

	return { confirmEmail }
}
