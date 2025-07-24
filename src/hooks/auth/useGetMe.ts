import { authService } from '@/services/auth.service'
import { IGetUserData } from '@/types/auth.types'
import { useQuery } from '@tanstack/react-query'

export const useGetMe = () => {
	const { data: userData } = useQuery<IGetUserData>({
		queryKey: ['getMe'],
		queryFn: () => authService.getMe(),
	})

	return { userData }
}
