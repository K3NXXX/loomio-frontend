import axiosInstance from '@/lib/axios'

import type {
	ICreateProjectRequest,
	ICreateProjectRequestResponse,
	IGetAllProjectsResponse,
	IGetOneProjectRequest,
	IGetOneProjectResponse,
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

	async getAllProjects(): Promise<IGetAllProjectsResponse[]> {
		const { data } = await axiosInstance.get<IGetAllProjectsResponse[]>(
			`${this.BASE_URL}`,
		)
		return data
	}

	async getOneProject({
		projectId,
	}: IGetOneProjectRequest): Promise<IGetOneProjectResponse> {
		const { data } = await axiosInstance.get<IGetOneProjectResponse>(
			`${this.BASE_URL}/${projectId}`,
		)
		return data
	}
}

export const projectService = new ProjectService()
