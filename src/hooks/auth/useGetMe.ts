import { useQuery } from '@tanstack/react-query'

import { userService } from '@/services/user.service'

import type { IGetUserData } from '@/types/auth.types'

export const useGetMe = () => {
	const { data: userData } = useQuery<IGetUserData>({
		queryKey: ['getMe'],
		queryFn: () => userService.getMe(),
	})

	return { userData }
}
