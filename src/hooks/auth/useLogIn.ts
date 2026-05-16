import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'

import type { ILogInRequest } from '@/types/auth.types'
import { useTranslations } from 'next-intl'

export const useLogIn = () => {
	const router = useRouter()
	const queryClient = useQueryClient()
	const t = useTranslations()
	const { mutate: logIn } = useMutation({
		mutationKey: ['logIn'],
		mutationFn: (data: ILogInRequest) => authService.login(data),
		onSuccess: (data) => {
			void queryClient.invalidateQueries({ queryKey: ['getMe'] })
			const dest =
				data.user?.role === 'ADMIN'
					? PAGES.MODERATION_DASHBOARD
					: PAGES.HOME
			router.replace(dest)
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
