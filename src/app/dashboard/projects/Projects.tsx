import { CreateProjectForm } from '@/components/dashboard/projects/create-project-form/CreateProjectForm'
import { ProjectsHeader } from '@/components/dashboard/projects/ProjectsHeader'
import { ProjectsInput } from '@/components/dashboard/projects/ProjectsInput'
import { ProjectsList } from '@/components/dashboard/projects/ProjectsList'
import { ProjectsTotalInfo } from '@/components/dashboard/projects/ProjectsTotalInfo'

export function Projects() {
	return (
		<div>
			<ProjectsHeader />
			<div className='flex flex-col gap-5 pb-20'>
				<ProjectsInput />
				<ProjectsTotalInfo />
				<ProjectsList />
			</div>
			<CreateProjectForm />
		</div>
	)
}
