'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { IoClose, IoSearchSharp } from 'react-icons/io5'

interface IFormSecondStepProps {
	register: UseFormRegister<ICreateProjectFormData>
	handleSubmit: UseFormHandleSubmit<ICreateProjectFormData>
	setStep: (step: number) => void
}

export function FormSecondStep({ setStep }: IFormSecondStepProps) {
	const [searchValue, setSearchValue] = useState('')

	return (
		<div className='flex flex-col h-full'>
			<div className='flex flex-col gap-3 flex-grow'>
				<div className='flex flex-col flex-1'>
					<p className='text-white mb-2'>
						Add members to your project (optional)
					</p>
					<div className='relative flex-1'>
						<IoSearchSharp size={20} className='absolute top-3 left-3' />
						{searchValue && (
							<IoClose
								onClick={() => setSearchValue('')}
								size={20}
								className='absolute top-3 right-3 cursor-pointer'
							/>
						)}
						<Input
							value={searchValue}
							onChange={e => setSearchValue(e.target.value)}
							className='py-5 px-10 w-full'
							placeholder='Search members...'
						/>
					</div>
				</div>
			</div>

			<div className='pt-5 flex justify-between'>
				<Button
					onClick={() => setStep(1)}
					type='button'
					variant='secondary'
					className='w-25 font-bold'
				>
					Back
				</Button>
				<Button
					onClick={() => setStep(3)}
					type='button'
					className='w-25 font-bold'
				>
					Next step
				</Button>
			</div>
		</div>
	)
}
