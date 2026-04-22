import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'

import type {
	IEmailVerification,
	IEmailVerificationResponse,
} from '@/types/auth.types'
import { useTranslations } from 'next-intl'

export const useEmailVerification = () => {
	const router = useRouter()
	const t = useTranslations()
	const { mutate: confirmEmail } = useMutation({
		mutationKey: ['emailVerification'],
		mutationFn: (data: IEmailVerification) =>
			authService.emailVerification(data),
		onSuccess: (data: IEmailVerificationResponse) => {
			if (data.user) {
				localStorage.setItem('user', JSON.stringify(data.user))
			}
			toast(t('success.registrationCompleted'))
			router.push(PAGES.LOGIN)
		},
		onError: () => {
			toast('Invalid code. Try again')
		},
	})

	return { confirmEmail }
}
