import { projectService } from '@/services/project.service'
import type { IGetAllProjectsResponse } from '@/types/project.types'
import { useQuery } from '@tanstack/react-query'

export const useGetAllProjects = () => {
	const { data: allProjects, isLoading: getAllProjectsLoading } = useQuery<
		IGetAllProjectsResponse[]
	>({
		queryKey: ['getAllProjects'],
		queryFn: () => projectService.getAllProjects(),
	})

	return { allProjects, getAllProjectsLoading }
}
