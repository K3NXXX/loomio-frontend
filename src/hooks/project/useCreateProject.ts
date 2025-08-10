import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { projectService } from '@/services/project.service'

import type { ICreateProjectRequest } from '@/types/project.types'

export const useCreateProject = () => {
	const queryClient = useQueryClient()
	const [createdProjectSuccess, setCreatedProjectSuccess] = useState(false)
	const { mutate: createProject, isPending: creatingProjectLoading } =
		useMutation({
			mutationKey: ['createProject'],
			mutationFn: (data: ICreateProjectRequest) =>
				projectService.createProject(data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['getAllProjects'] })
				toast.success('Project created')
				setCreatedProjectSuccess(true)
			},
		})

	return { createProject, creatingProjectLoading, createdProjectSuccess }
}
