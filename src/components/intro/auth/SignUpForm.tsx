'use client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'

export function SignUpForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ reValidateMode: 'onSubmit' })
	return (
		<div className='mt-30 flex flex-col items-center'>
			<p className='text-white font-bold text-[30px]'>Welcome back!</p>
			<p className='text-gray-200  text-[18px]'>
				Use this awesome form to register your account.
			</p>
			<Card className='bg-neutral-900 py-7 px-3 w-[448px] mt-5'>
				<form className='flex flex-col gap-5 justify-center'>
					<div className='flex gap-3'>
						<div className='flex flex-col flex-1'>
							<p className='text-white mb-2'>First name</p>
							<Input 	placeholder='Your first name' className='w-full text-white py-5' />
						</div>
						<div className='flex flex-col flex-1'>
							<p className='text-white mb-2'>Last name</p>
							<Input 	placeholder='Your last name' className='w-full text-white py-5' />
						</div>
					</div>
					<div className='flex flex-col'>
						<p className='text-white mb-2'>Email</p>
						<Input
							placeholder='Your email address'
							className='text-white py-5'
						/>
					</div>
				</form>
			</Card>
		</div>
	)
}
