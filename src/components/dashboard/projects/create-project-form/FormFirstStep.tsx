import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import type { TCreateProjectSchema } from '@/schemas/create-project.schema'
import type { TCreateProjectSteps } from '@/types/project.types'
import type { UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'

interface IFormFirstStepProps {
	register: UseFormRegister<TCreateProjectSchema>
	handleSubmit: UseFormHandleSubmit<TCreateProjectSchema>
	setStep: (step: TCreateProjectSteps) => void
}

export default function FormFirstStep({
	register,
	setStep,
	handleSubmit,
}: IFormFirstStepProps) {
	return (
		<div className='flex flex-col gap-3 h-full'>
			<div className='flex flex-col flex-grow'>
				<div className='flex flex-col flex-1'>
					<label htmlFor='project-name' className='text-white mb-2'>
						Project name
					</label>
					<Input
						id='project-name'
						autoFocus
						placeholder='e.g. Team Collaboration App'
						className='text-white py-5'
						{...register('name')}
					/>
				</div>
				<div className='flex flex-col flex-1'>
					<label htmlFor='project-description' className='text-white mb-2'>
						Project description (optional)
					</label>
					<Textarea
						id='project-description'
						placeholder='Your project description'
						className='text-white h-45 py-3 resize-none w-0 min-w-full'
						{...register('description')}
					/>
				</div>
			</div>
			<div className='flex justify-end mt-5'>
				<Button
					onClick={handleSubmit(() => setStep(2))}
					className='w-25 font-bold'
				>
					Next step
				</Button>
			</div>
		</div>
	)
}
