import { authService } from '@/services/auth.service'
import { useQuery } from '@tanstack/react-query'

export const useOAuth = (provider: string) => {
	const {data} = useQuery({
		queryKey: ['oauth'],
		queryFn: () => authService.oauth(provider)
	})

	return data
}