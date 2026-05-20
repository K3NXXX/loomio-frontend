import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'
import {
	getToastApiMessage,
	PASSWORD_RESET_LINK_EXPIRED_MESSAGE,
} from '@/utils/toastMessage'

import type { IResetPasswordRequest } from '@/types/auth.types'

export const useResetPassword = () => {
	const router = useRouter()
	const t = useTranslations('toast')
	const { mutate: resetPassword, isPending: loading } = useMutation({
		mutationKey: ['resetPassword'],
		mutationFn: (data: IResetPasswordRequest) =>
			authService.resetPassword(data),
		onSuccess: () => {
			router.replace(PAGES.LOGIN)
			toast.success(t('passwordChanged'))
		},
		onError: (error: { response?: { data?: { message?: string } } }) => {
			const msg = error?.response?.data?.message
			toast.error(getToastApiMessage(msg, t))
			if (msg === PASSWORD_RESET_LINK_EXPIRED_MESSAGE) {
				router.push(PAGES.FORGOT_PASSWORD)
			}
		},
	})
	return { resetPassword, loading }
}
