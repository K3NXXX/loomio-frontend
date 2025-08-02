import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'

import type {
	IEmailVerification,
	IEmailVerificationResponse,
} from '@/types/auth.types'

export const useEmailVerification = () => {
	const router = useRouter()
	const { mutate: confirmEmail } = useMutation({
		mutationKey: ['emailVerification'],
		mutationFn: (data: IEmailVerification) =>
			authService.emailVerification(data),
		onSuccess: (data: IEmailVerificationResponse) => {
			if (data.user) {
				localStorage.setItem('user', JSON.stringify(data.user))
			}
			toast('Registration completed!')
			router.push(PAGES.DASHBOARD)
		},
		onError: () => {
			toast('Invalid code. Try again')
		},
	})

	return { confirmEmail }
}
