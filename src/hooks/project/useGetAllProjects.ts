import { useQuery } from '@tanstack/react-query'

import { projectService } from '@/services/project.service'

import type { IGetAllProjectsResponse } from '@/types/project.types'

export const useGetAllProjects = () => {
	const { data: allProjects, isLoading: getAllProjectsLoading } = useQuery<
		IGetAllProjectsResponse[]
	>({
		queryKey: ['getAllProjects'],
		queryFn: () => projectService.getAllProjects(),
	})

	return { allProjects, getAllProjectsLoading }
}
