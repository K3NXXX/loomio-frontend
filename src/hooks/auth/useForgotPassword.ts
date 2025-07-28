import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { authService } from '@/services/auth.service'

import type { IForgotPasswordRequest } from '@/types/auth.types'

export const useForgotPassword = (setStep: (step: number) => void) => {
	const [expiresAt, setExpiresAt] = useState<Date | undefined>()
	const { mutate: forgotPassword, isPending: loading } = useMutation({
		mutationKey: ['forgotPassword'],
		mutationFn: (data: IForgotPasswordRequest) =>
			authService.forgotPassword(data),
		onSuccess: (data) => {
			setStep(2)
			setExpiresAt(data.expiresAt)
		},
		onError: (error: any) => {
			if (error?.response?.data?.statusCode === 429) {
				toast(error?.response?.data?.message)
			}
			setExpiresAt(error.response.data?.expiresAt || 60)
		},
	})
	return { forgotPassword, loading, expiresAt, setExpiresAt }
}
