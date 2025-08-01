import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { projectService } from '@/services/project.service'

import type { ICreateProjectRequest } from '@/types/project.types'

export const useCreateProject = () => {
	const { mutate: createProject } = useMutation({
		mutationKey: ['createProject'],
		mutationFn: (data: ICreateProjectRequest) =>
			projectService.createProject(data),
		onSuccess: () => {
			toast.success('Project created')
		},
	})

	return { createProject }
}
