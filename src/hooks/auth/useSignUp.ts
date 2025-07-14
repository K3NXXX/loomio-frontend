import { authService } from '@/services/auth.service'
import { ISignupApiData } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export const useSignUp = () => {
	const [isSuccessSignUp, setIsSuccessSignUp] = useState(false)
	const [retryAfter, setRetryAfter] = useState<number>(60)
	const { mutate: signUp, isPending } = useMutation({
		mutationKey: ['signup'],
		mutationFn: (data: ISignupApiData) => authService.signup(data),
		onSuccess: () => {
			setIsSuccessSignUp(true)
		},
		onError: (error: any) => {
			if (
				error?.response?.status === 409 &&
				error?.response?.data?.message !== 'User with this email already exists'
			) {
				const serverRetry = error.response.data?.retryAfter || 60
				setRetryAfter(serverRetry)
				setIsSuccessSignUp(true)
			}
			if (
				error?.response?.data?.message === 'User with this email already exists'
			) {
				toast(error?.response?.data?.message)
			}
		},
	})

	return { signUp, isSuccessSignUp, setIsSuccessSignUp, isLoading: isPending }
}
