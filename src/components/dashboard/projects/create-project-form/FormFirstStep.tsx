import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'

interface IFormFirstStepProps {
	register: UseFormRegister<ICreateProjectFormData>
	handleSubmit: UseFormHandleSubmit<ICreateProjectFormData>
	setStep: (step: number) => void
}

export function FormFirstStep({
	register,
	setStep,
	handleSubmit,
}: IFormFirstStepProps) {
	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-col flex-1 '>
				<p className='text-white mb-2'>Project name</p>
				<Input
					placeholder='e.g. Team Collaboration App'
					className='text-white py-5'
					{...register('name', {
						required: 'Project name is required',
						minLength: {
							value: 3,
							message: 'Project name must be at least 3 characters long',
						},
						maxLength: {
							value: 100,
							message: 'Project name must be less than 100 characters',
						},
						pattern: {
							value: /^[\p{L}\d\s'.\-]{3,100}$/u,
							message:
								'Only letters, numbers, spaces, apostrophes, dots and dashes are allowed',
						},
						validate: value => {
							if (value.trim() !== value) {
								return 'Name must not start or end with spaces'
							}
							if (/\s{2,}/.test(value)) {
								return 'Avoid double spaces in project name'
							}
							return true
						},
					})}
				/>
			</div>
			<div className='flex flex-col flex-1'>
				<p className='text-white mb-2'>Project description</p>
				<Textarea
					placeholder='Your project description'
					className='w-full text-white h-35 py-3 resize-none whitespace-pre-wrap'
					{...register('description', {
						required: 'Project description is required',
						minLength: {
							value: 10,
							message: 'Description must be at least 10 characters long',
						},
						maxLength: {
							value: 500,
							message: 'Description must be less than 500 characters',
						},
						pattern: {
							value: /^[\p{L}\d\s.,:;!?"'’“”()\-–—\n\r]{10,500}$/u,
							message:
								'Only letters, numbers, common punctuation, and whitespace are allowed',
						},
						validate: value => {
							if (value.trim() !== value) {
								return 'Description must not start or end with spaces'
							}
							if (/^\s*$/.test(value)) {
								return 'Description cannot be only whitespace'
							}
							return true
						},
					})}
				/>
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
