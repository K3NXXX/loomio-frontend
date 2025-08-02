import { useQuery } from '@tanstack/react-query'

import { userService } from '@/services/user.service'

import type {
	ISearchProjectMembersRequest,
	ISearchProjectMembersResponse,
} from '@/types/project.types'

const buildSearchParams = ({
	name,
	cursor,
	take,
}: ISearchProjectMembersRequest) => {
	const params = new URLSearchParams({
		query: name,
		take: String(take),
	})

	if (cursor) {
		params.append('cursor', cursor)
	}

	return params.toString()
}

export const useSearchProjectMembers = (
	searchingData: ISearchProjectMembersRequest,
) => {
	const paramsString = buildSearchParams(searchingData)
	const { data: fetchedMembers, isFetching: searchProjectMembersLoading } =
		useQuery<ISearchProjectMembersResponse[]>({
			queryKey: [
				'searchProjectMembers',
				searchingData.name,
				searchingData.cursor,
			],
			queryFn: () => userService.searchProjectMembers(paramsString),
			enabled: searchingData.name.length >= 2,
		})

	return { fetchedMembers, searchProjectMembersLoading }
}
