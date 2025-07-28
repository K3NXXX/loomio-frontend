import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { authService } from '@/services/auth.service'

import type {
	IResendCodeRequest,
	IResendCodeResponse,
} from '@/types/auth.types'

export const useResendCode = () => {
	const [expiresAtResend, setExpiresAtResend] = useState<Date>()
	const { mutateAsync: resendCode, isPending } = useMutation({
		mutationKey: ['resendCode'],
		mutationFn: (data: IResendCodeRequest) => authService.resendCode(data),
		onSuccess: (data: IResendCodeResponse) => {
			setExpiresAtResend(data.expiresAt)
		},
		onError: (error: any) => {
			if (error?.response?.status === 409) {
				setExpiresAtResend(error.response.data?.expiresAt)
			}
		},
	})

	return { resendCode, expiresAtResend, loading: isPending }
}
