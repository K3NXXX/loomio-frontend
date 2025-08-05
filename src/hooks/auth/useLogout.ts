import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useLogout = () => {
	const router = useRouter()
	const { mutate: logout } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			router.push(PAGES.LOGIN)
		},
		onError: (error: any) => {
			toast(error?.response?.data?.message)
		},
	})

	return { logout }
}
