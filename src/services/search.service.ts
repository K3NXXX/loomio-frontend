import axiosInstance from '@/lib/axios'
import type { ISearchResponse, ISearchSuggestion } from '@/types/search.types'

class SearchService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/search`

	async getSearchSuggestions(
		searchQuery: string,
	): Promise<ISearchSuggestion[]> {
		const { data } = await axiosInstance.get<ISearchSuggestion[]>(
			`${this.BASE_URL}/suggest/?q=${encodeURIComponent(searchQuery)}`,
		)
		return data
	}

	async getSearchData(
		searchQuery: string,
		page = 1,
		limit = 20,
	): Promise<ISearchResponse> {
		const { data } = await axiosInstance.get<ISearchResponse>(
			`${this.BASE_URL}/?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`,
		)
		return data
	}
}

export const searchService = new SearchService()
