import axiosInstance from '@/lib/axios'

import type {
	ISearchProjectMembersRequest,
	ISearchProjectMembersResponse,
} from '@/types/project.types'

class ProjectService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/`

	async searchProjectMembers(searchingData: ISearchProjectMembersRequest) {
		const { name, take, cursor } = searchingData

		const params = new URLSearchParams({
			query: name,
			take: String(take),
		})

		if (cursor) {
			params.append('cursor', cursor)
		}
		const { data } = await axiosInstance.get<ISearchProjectMembersResponse[]>(
			`${this.BASE_URL}user/search?${params.toString()}`,
		)
		return data
	}
}

export const projectService = new ProjectService()
