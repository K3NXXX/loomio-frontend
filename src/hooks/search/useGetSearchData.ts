import { searchService } from '@/services/search.service'
import type { ISearchResponse } from '@/types/search.types'
import { useQuery } from '@tanstack/react-query'

export const useGetSearchData = (searchQuery: string) => {
	const { data, isError, isLoading } = useQuery<ISearchResponse>({
		queryKey: ['getSearchData', searchQuery],
		queryFn: () => searchService.getSearchData(searchQuery),
		enabled: !!searchQuery.trim(),
	})

	return {
		videos: data?.videos ?? [],
		channels: data?.channels ?? [],
		isLoading,
		isError,
	}
}
