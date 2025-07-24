'use client'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useProjectStore } from '@/zustand/store/projectStore'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormFirstStep } from './FormFirstStep'
import { StepIndicator } from './StepIndicator'
import { FormSecondStep } from './FormSecondStep'

export function CreateProjectForm() {
	const { isProjectCreatingFormOpened, setIsProjectCreatingFormOpened } =
		useProjectStore()
	const [step, setStep] = useState(1)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ICreateProjectFormData>({ reValidateMode: 'onSubmit' })

	const onSubmit: SubmitHandler<ICreateProjectFormData> = data => {
		console.log(data)
	}

	useEffect(() => {
		if (errors.name?.message) {
			toast(errors.name.message)
		}
		if (errors.description?.message) {
			toast(errors.description.message)
		}
	}, [errors.name, errors.description])
	return (
		<Dialog
			open={isProjectCreatingFormOpened}
			onOpenChange={setIsProjectCreatingFormOpened}
		>
			<DialogContent className='z-50'>
				<DialogHeader className='flex-col gap-3'>
					<DialogTitle className='text-[25px]'>Create project</DialogTitle>
					<DialogDescription className='text-muted-foreground text-sm'>
						Create a new project to start organizing your business tasks, invite
						your team, and work together toward shared goals.ц
					</DialogDescription>
				</DialogHeader>
				<Progress value={step * 33.3} />
				<div className='flex justify-between'>
					<StepIndicator number={1} label='Step 1' active={step >= 1} />
					<StepIndicator number={2} label='Step 2' active={step >= 2} />
					<StepIndicator number={3} label='Step 3' active={step >= 3} />
				</div>
				<form
					className='w-[460px] min-h-[326px]'
					onSubmit={handleSubmit(onSubmit)}
				>
					{step === 1 && (
						<FormFirstStep
							setStep={setStep}
							handleSubmit={handleSubmit}
							register={register}
						/>
					)}
					{step === 2 && (
						<FormSecondStep setStep={setStep}/>
					)}
				</form>
			</DialogContent>
		</Dialog>
	)
}
