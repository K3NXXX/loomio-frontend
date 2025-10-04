import { useQuery } from '@tanstack/react-query'

import { authService } from '@/services/auth.service'
import type { IGetUserData } from '@/types/auth.types'

export const useGetMe = () => {
	const { data: userData } = useQuery<IGetUserData>({
		queryKey: ['getMe'],
		queryFn: () => authService.getMe(),
	})

	return { userData }
}
