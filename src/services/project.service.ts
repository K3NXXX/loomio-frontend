import axiosInstance from '@/lib/axios'

import type {
	ICreateProjectRequest,
	ICreateProjectRequestResponse,
} from '@/types/project.types'

class ProjectService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/projects`

	async createProject(
		projectData: ICreateProjectRequest,
	): Promise<ICreateProjectRequestResponse> {
		const { data } = await axiosInstance.post<ICreateProjectRequestResponse>(
			`${this.BASE_URL}`,
			projectData,
		)
		return data
	}
}

export const projectService = new ProjectService()
