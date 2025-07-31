import { useQuery } from '@tanstack/react-query'

import { projectService } from '@/services/project.service'

import type {
	ISearchProjectMembersRequest,
	ISearchProjectMembersResponse,
} from '@/types/project.types'

export const useSearchProjectMembers = (
	searchingData: ISearchProjectMembersRequest,
) => {
	const { data: fetchedMembers, isFetching: searchProjectMembersLoading } =
		useQuery<ISearchProjectMembersResponse[]>({
			queryKey: [
				'searchProjectMembers',
				searchingData.name,
				searchingData.take,
				searchingData.cursor,
			],
			queryFn: () => projectService.searchProjectMembers(searchingData),
			enabled: searchingData.name.length >= 2,
		})

	return { fetchedMembers, searchProjectMembersLoading }
}
