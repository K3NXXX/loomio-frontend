import { ProjectsInput } from '@/components/dashboard/projects/ProjectsInput'
import { ProjectsList } from '@/components/dashboard/projects/ProjectsList'
import { ProjectsTotalInfo } from '@/components/dashboard/projects/ProjectsTotalInfo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'


import { TiPlus } from 'react-icons/ti'

export function Projects() {
	return (
		<div>
			<div className='flex justify-between items-center mb-5'>
				<div className='flex flex-col'>
					<h1 className='font-bold text-[24px]'>Projects</h1>
					<p className='text-[16px]'>
						Manage your projects and follow teams' progress
					</p>
				</div>
				<div className='flex gap-3'>
					<div className='flex gap-3 items-center'>
						<Badge className='font-bold text-[14px] px-4' variant='secondary'>
							5 in total
						</Badge>
						<Badge className='font-bold text-[14px] px-4'>
							3 active
						</Badge>
					</div>
					<Button className='font-bold text-[16px] py-5 flex items-center'>
						<TiPlus /> <p>Create project</p>
					</Button>
				</div>
			</div>
			<div className='flex flex-col gap-5 pb-20'>
				<ProjectsInput />
				<ProjectsTotalInfo />
				<ProjectsList/>
			</div>
		</div>
	)
}
