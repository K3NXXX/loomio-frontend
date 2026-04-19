import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { authService } from '@/services/auth.service'

import type {
	IResendCodeRequest,
	IResendCodeResponse,
} from '@/types/auth.types'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useResendCode = () => {
	const [expiresAtResend, setExpiresAtResend] = useState<Date>()
	const t = useTranslations()
	const { mutateAsync: resendCode, isPending } = useMutation({
		mutationKey: ['resendCode'],
		mutationFn: (data: IResendCodeRequest) => authService.resendCode(data),
		onSuccess: (data: IResendCodeResponse) => {
			setExpiresAtResend(data.expiresAt)
		},
		onError: (error: any) => {
			const data = error?.response?.data
			const code = data?.code

			if (error?.response?.status === 409) {
				setExpiresAtResend(data?.expiresAt)
			}

			if (code) {
				toast(t(`errors.${code}`, data))
			} else {
				toast(t('errors.unknown'))
			}
		},
	})

	return { resendCode, expiresAtResend, loading: isPending }
}
