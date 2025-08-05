import { projectService } from '@/services/project.service'
import type { IGetAllProjects } from '@/types/project.types'
import { useQuery } from '@tanstack/react-query'

export const useGetAllProjects = () => {
	const { data: allProjects, isLoading: getAllProjectsLoading } = useQuery<
		IGetAllProjects[]
	>({
		queryKey: ['getAllProjects'],
		queryFn: () => projectService.getAllProjects(),
	})

	return { allProjects, getAllProjectsLoading }
}
