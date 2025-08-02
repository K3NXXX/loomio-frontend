import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

import { StepIndicator } from './StepIndicator'

interface ICreateProjectFormHeaderProps {
	step: number
}

export function CreateProjectFormHeader({
	step,
}: ICreateProjectFormHeaderProps) {
	return (
		<>
			<DialogHeader className='flex-col gap-3'>
				<DialogTitle className='text-[25px]'>Create project</DialogTitle>
				<DialogDescription className='text-muted-foreground text-sm'>
					Create a new project to start organizing your business tasks, invite
					your team, and work together toward shared goals
				</DialogDescription>
			</DialogHeader>
			<Progress value={step * 33.3} />
			<div className='flex justify-between'>
				<StepIndicator number={1} label='Step 1' active={step >= 1} />
				<StepIndicator number={2} label='Step 2' active={step >= 2} />
				<StepIndicator number={3} label='Step 3' active={step >= 3} />
			</div>
		</>
	)
}
