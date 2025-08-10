import { useQuery } from '@tanstack/react-query'

import { projectService } from '@/services/project.service'

import type {
	IGetOneProjectRequest,
	IGetOneProjectResponse,
} from '@/types/project.types'

export const useGetOneProject = (projectId: IGetOneProjectRequest) => {
	const { data: project, isLoading: getProjectLoading } =
		useQuery<IGetOneProjectResponse>({
			queryKey: ['getOneProject'],
			queryFn: () => projectService.getOneProject(projectId),
		})

	return { project, getProjectLoading }
}
