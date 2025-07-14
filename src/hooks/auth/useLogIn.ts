import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'
import { IEmailVerificationResponse, ILogInApiData } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useLogIn = () => {
	const {push} = useRouter()
	const { mutate: logIn } = useMutation({
		mutationKey: ['logIn'],
		mutationFn: (data: ILogInApiData) => authService.login(data),
		onSuccess: (data: IEmailVerificationResponse) => {
			console.log("userData", data)
			localStorage.setItem('token', data.accessToken)
			localStorage.setItem('user', JSON.stringify(data.user))
			push(PAGES.DASHBOARD)
		},
		onError: () => {
			toast("Invalid email or password")
		}
	})

	return { logIn }
}
