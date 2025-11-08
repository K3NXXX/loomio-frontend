import { searchService } from '@/services/search.service'
import type { ISearchSuggestion } from '@/types/search.types'
import { useQuery } from '@tanstack/react-query'

export const useGetSearchSuggestions = (searchQuery: string) => {
	const {
		data: searchSuggestions,
		isError,
		isLoading,
	} = useQuery<ISearchSuggestion[]>({
		queryKey: ['getSearchSuggestions', searchQuery],
		queryFn: () => searchService.getSearchSuggestions(searchQuery),
		enabled: searchQuery.trim().length > 2,
		staleTime: 1000 * 10,
	})

	return { searchSuggestions, isLoading, isError }
}
