import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'

import type {
	IEmailVerificationResponse,
	ILogInRequest,
} from '@/types/auth.types'

export const useLogIn = () => {
	const router = useRouter()
	const { mutate: logIn } = useMutation({
		mutationKey: ['logIn'],
		mutationFn: (data: ILogInRequest) => authService.login(data),
		onSuccess: (data: IEmailVerificationResponse) => {
			localStorage.setItem('user', JSON.stringify(data.user))
			router.replace(PAGES.HOME)
		},
		onError: (error: any) => {
			toast(error?.response?.data?.message)
		},
	})

	return { logIn }
}
