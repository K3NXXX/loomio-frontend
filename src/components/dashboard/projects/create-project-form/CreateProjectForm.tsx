'use client'
import { lazy, Suspense, useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import Lottie from 'lottie-react'
import { useForm } from 'react-hook-form'

import loader from '@/assets/animations/loader.json'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCreateProject } from '@/hooks/project/useCreateProject'
import { useCreateProjectFormErrors } from '@/hooks/project/useCreateProjectFormErrors'
import { createProjectSchema } from '@/schemas/create-project.schema'
import { CREATE_PROJECT_FORM_STEPS } from '@/types/project.types'
import { useProjectStore } from '@/zustand/store/projectStore'

import { CreateProjectFormHeader } from './CreateProjectFormHeader'

import type { TCreateProjectSchema } from '@/schemas/create-project.schema'
import type { SubmitHandler } from 'react-hook-form'

const FormFirstStep = lazy(() => import('./FormFirstStep'))
const FormSecondStep = lazy(() => import('./FormSecondStep'))
const FormThirdStep = lazy(() => import('./FormThirdStep'))

export function CreateProjectForm() {
	const [step, setStep] = useState(CREATE_PROJECT_FORM_STEPS.FIRST)

	const {
		selectedMembers,
		isProjectCreatingFormOpened,
		setIsProjectCreatingFormOpened,
	} = useProjectStore()
	const { createProject, creatingProjectLoading, createdProjectSuccess } =
		useCreateProject()

	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<TCreateProjectSchema>({
		reValidateMode: 'onSubmit',
		resolver: zodResolver(createProjectSchema),
	})
	useCreateProjectFormErrors(errors)

	const projectName = watch('name')
	const projectDescription = watch('description')

	const onSubmit: SubmitHandler<TCreateProjectSchema> = (data) => {
		const projectData = {
			name: data.name,
			description: data.description,
			members: selectedMembers.map((member) => ({
				userId: member.id,
				role: member.role,
			})),
		}
		createProject(projectData)
	}

	useEffect(() => {
		if (createdProjectSuccess) {
			setIsProjectCreatingFormOpened(false)
			reset()
			setStep(CREATE_PROJECT_FORM_STEPS.FIRST)
		}
	}, [createdProjectSuccess, setIsProjectCreatingFormOpened, reset])

	return (
		<Dialog
			open={isProjectCreatingFormOpened}
			onOpenChange={setIsProjectCreatingFormOpened}
		>
			<DialogContent className='z-50'>
				<CreateProjectFormHeader step={step} />
				<form className=' min-h-[370px]' onSubmit={handleSubmit(onSubmit)}>
					<Suspense
						fallback={
							<div className='w-full h-[370px] flex items-center justify-center'>
								<Lottie
									animationData={loader}
									loop
									className='w-[140px] h-[140px]'
								/>
							</div>
						}
					>
						{step === CREATE_PROJECT_FORM_STEPS.FIRST && (
							<FormFirstStep
								setStep={setStep}
								handleSubmit={handleSubmit}
								register={register}
							/>
						)}
						{step === CREATE_PROJECT_FORM_STEPS.SECOND && (
							<FormSecondStep setStep={setStep} />
						)}
						{step === CREATE_PROJECT_FORM_STEPS.THIRD && (
							<FormThirdStep
								projectName={projectName}
								projectDescription={projectDescription}
								setStep={setStep}
								creatingProjectLoading={creatingProjectLoading}
							/>
						)}
					</Suspense>
				</form>
			</DialogContent>
		</Dialog>
	)
}
