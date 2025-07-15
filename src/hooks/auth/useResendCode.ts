import { authService } from '@/services/auth.service'
import { IResendCode } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

export const useResendCode = () => {
	const [expiresAtResend, setExpiresAtResend] = useState<number>(60)
	const { mutateAsync: resendCode } = useMutation({
		mutationKey: ['resendCode'],
		mutationFn: (data: IResendCode) => authService.resendCode(data),
		onError: (error: any) => {
			if (
				error?.response?.status === 409 &&
				error?.response?.data?.message !== 'User with this email already exists'
			) {
				const expiresAt = error.response.data?.expiresAt || 60
				setExpiresAtResend(expiresAt)
			}
		},
	})

	return { resendCode, expiresAtResend }
}
