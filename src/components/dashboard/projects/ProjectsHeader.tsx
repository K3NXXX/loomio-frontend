'use client'
import { TiPlus } from 'react-icons/ti'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useProjectStore } from '@/zustand/store/projectStore'

export function ProjectsHeader() {
	const { setIsProjectCreatingFormOpened } = useProjectStore()
	return (
		<div className='flex justify-between items-center mb-5'>
			<div className='flex flex-col'>
				<h1 className='font-bold text-[24px]'>Projects</h1>
				<p className='text-[16px]'>
					Manage your projects and follow teams&apos; progress
				</p>
			</div>
			<div className='flex gap-3'>
				<div className='flex gap-3 items-center'>
					<Badge className='font-bold text-[14px] px-4' variant='secondary'>
						5 in total
					</Badge>
					<Badge className='font-bold text-[14px] px-4'>3 active</Badge>
				</div>
				<Button
					onClick={() => setIsProjectCreatingFormOpened(true)}
					className='font-bold text-[16px] py-5 flex items-center'
					aria-label='Create new project'
				>
					<TiPlus aria-hidden='true' /> <p>Create project</p>
				</Button>
			</div>
		</div>
	)
}
