import axiosInstance from '@/lib/axios'

import type {
	ISearchProjectMembersRequest,
	ISearchProjectMembersResponse,
} from '@/types/project.types'

class ProjectService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/`

	async searchProjectMembers(searchingData: ISearchProjectMembersRequest) {
		const { data } = await axiosInstance.get<ISearchProjectMembersResponse[]>(
			`${this.BASE_URL}user/search?query=${searchingData.name}&take=10`,
		)
		return data
	}
}

export const projectService = new ProjectService()
