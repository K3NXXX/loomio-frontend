'use client'
import { useState } from 'react'

import { Controller, useFormContext } from 'react-hook-form'
import { BsFillEyeSlashFill } from 'react-icons/bs'
import { HiEye } from 'react-icons/hi'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useSignupFormErrors } from '@/hooks/auth/useSignupFormErrors'

import type { TSignupSchema } from '@/schemas/auth/signup-schema'

export function SignUpFormFields() {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const { register, control } = useFormContext<TSignupSchema>()
	useSignupFormErrors()

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword)
	}

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword)
	}
	return (
		<>
			<div className='flex gap-3 max-[540px]:flex-col'>
				<div className='flex flex-col flex-1 '>
					<label htmlFor='signup-name' className='text-white mb-2'>
						Full name
					</label>
					<Input
						id='signup-name'
						placeholder='John Doe'
						className='w-full text-white py-6'
						{...register('name')}
					/>
				</div>
				<div className='flex flex-col flex-1'>
					<label htmlFor='signup-username' className='text-white mb-2'>
						Username
					</label>
					<Input
						id='signup-username'
						placeholder='johnsmith'
						className='w-full text-white py-6'
						{...register('username')}
					/>
				</div>
			</div>
			<div className='flex flex-col'>
				<label htmlFor='signup-email' className='text-white mb-2'>
					Email
				</label>
				<Input
					type='email'
					id='signup-email'
					placeholder='Your email address'
					className='text-white py-6'
					{...register('email')}
				/>
			</div>
			<div className='flex gap-3 max-[540px]:flex-col'>
				<div className='flex flex-col'>
					<label htmlFor='signup-password' className='text-white mb-2'>
						Password
					</label>
					<div className='relative'>
						{showPassword ? (
							<HiEye
								onClick={handleClickShowPassword}
								className='absolute top-[17px] right-[15px] cursor-pointer'
								color='white'
							/>
						) : (
							<BsFillEyeSlashFill
								onClick={handleClickShowPassword}
								className='absolute top-[17px] right-[15px] cursor-pointer'
								color='white'
							/>
						)}
						<Input
							id='signup-password'
							type={showPassword ? 'text' : 'password'}
							placeholder='Your password'
							className='text-white py-6 pr-10'
							{...register('password')}
						/>
					</div>
				</div>
				<div className='flex flex-col'>
					<label htmlFor='signup-confirm-password' className='text-white mb-2'>
						Confirm password
					</label>
					<div className='relative'>
						{showConfirmPassword ? (
							<HiEye
								onClick={handleClickShowConfirmPassword}
								className='absolute top-[17px] right-[15px] cursor-pointer'
								color='white'
							/>
						) : (
							<BsFillEyeSlashFill
								onClick={handleClickShowConfirmPassword}
								className='absolute top-[17px] right-[15px] cursor-pointer'
								color='white'
							/>
						)}
						<Input
							id='signup-confirm-password'
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder='Confirm your password'
							className='text-white py-6 pr-10'
							{...register('passwordConfirm')}
						/>
					</div>
				</div>
			</div>
			<div className='flex items-center gap-3 max-[375px]:items-start'>
				<Controller
					name='termsAccepted'
					control={control}
					render={({ field }) => (
						<div className='flex items-center gap-3  pt-[1px] max-[375px]:items-start'>
							<Checkbox
								checked={field.value}
								onCheckedChange={(checked) => {
									field.onChange(checked === true)
								}}
								className='max-[375px]:mt-[4px]'
								id='signup-terms-checkbox'
							/>
						</div>
					)}
				/>
				<label htmlFor='signup-terms-checkbox' className='text-white'>
					I agree to the terms and conditions
				</label>
			</div>
		</>
	)
}
