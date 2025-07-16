import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'
import { IResetPasswordApiData } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useResetPassword = () => {
	const { push } = useRouter()
	const { mutate: resetPassword, isPending: loading } = useMutation({
		mutationKey: ['resetPassword'],
		mutationFn: (data: IResetPasswordApiData) =>
			authService.resetPassword(data),
		onSuccess: () => {
			push(PAGES.LOGIN)
			toast.success('Password successfully changed')
		},
		onError: (error: any) => {
			toast(error?.response?.data?.message)
		},
	})
	return { resetPassword, loading }
}
