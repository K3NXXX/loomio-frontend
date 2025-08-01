import { useQuery } from '@tanstack/react-query'

import { userService } from '@/services/user.service'
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
				searchingData.cursor,
			],
			queryFn: () => userService.searchProjectMembers(searchingData),
			enabled: searchingData.name.length >= 2,
		})

	return { fetchedMembers, searchProjectMembersLoading }
}
