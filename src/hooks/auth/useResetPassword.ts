import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'

import type { IResetPasswordRequest } from '@/types/auth.types'

export const useResetPassword = () => {
	const router = useRouter()
	const { mutate: resetPassword, isPending: loading } = useMutation({
		mutationKey: ['resetPassword'],
		mutationFn: (data: IResetPasswordRequest) =>
			authService.resetPassword(data),
		onSuccess: () => {
			router.replace(PAGES.LOGIN)
			toast.success('Password successfully changed')
		},
		onError: (error: any) => {
			toast(error?.response?.data?.message)
			if (
				error?.response?.data?.message ===
				'The password reset link is invalid or has expired. Please request a new one'
			) {
				router.push(PAGES.FORGOT_PASSWORD)
			}
		},
	})
	return { resetPassword, loading }
}
