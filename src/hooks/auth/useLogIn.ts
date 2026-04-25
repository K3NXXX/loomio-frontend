import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'

import type {
	ILogInRequest,
} from '@/types/auth.types'
import { useTranslations } from 'next-intl'

export const useLogIn = () => {
	const router = useRouter()
	const t = useTranslations()
	const { mutate: logIn } = useMutation({
		mutationKey: ['logIn'],
		mutationFn: (data: ILogInRequest) => authService.login(data),
		onSuccess: () => {
			router.replace(PAGES.HOME)
		},
		onError: (error: any) => {
			const code = error?.response?.data?.code

			if (code) {
				toast(t(`errors.${code}`))
			} else {
				toast(t('errors.unknown'))
			}
		},
	})

	return { logIn }
}
