'use client'
import { useEffect, useState } from 'react'

import Lottie from 'lottie-react'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { BsFillEyeSlashFill } from 'react-icons/bs'
import { HiEye } from 'react-icons/hi'
import { toast } from 'sonner'

import loader from '@/assets/animations/loader.json'
import { AuthSocialButtons } from '@/components/ui/AuthSocialButtons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useSignUp } from '@/hooks/auth/useSignUp'

import { EmailVerificationForm } from './EmailVerificationForm'

import type { ISignupFormData } from '@/types/auth.types'
import type { SubmitHandler } from 'react-hook-form'

export function SignUpForm() {
	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<ISignupFormData>({ reValidateMode: 'onSubmit' })
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [email, setEmail] = useState('')
	const password = watch('password')

	const {
		signUp,
		isSuccessSignUp,
		setIsSuccessSignUp,
		isLoading,
		expiresAt,
		setExpiresAt,
	} = useSignUp()

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword)
	}

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword)
	}

	const onSubmit: SubmitHandler<ISignupFormData> = (data) => {
		const signUpData = {
			email: data.email,
			password: data.password,
			confirmPassword: data.passwordConfirm,
			name: data.name,
			username: data.username,
		}
		signUp(signUpData)
		setEmail(data.email)
	}

	useEffect(() => {
		if (errors.name?.message) {
			toast(errors.name.message)
		}
		if (errors.username?.message) {
			toast(errors.username.message)
		}
		if (errors.email?.message) {
			toast(errors.email.message)
		}
		if (errors.password?.message) {
			toast(errors.password.message)
		}
		if (errors.passwordConfirm?.message) {
			toast(errors.passwordConfirm.message)
		}
		if (errors.termsAccepted?.message) {
			toast(errors.termsAccepted.message)
		}
	}, [
		errors.name,
		errors.username,
		errors.email,
		errors.password,
		errors.passwordConfirm,
		errors.termsAccepted,
	])

	return (
		<div className='mt-20 flex flex-col items-center max-[1120px]:w-screen px-3'>
			<p className='text-white font-bold text-[30px] max-[540px]:text-[24px]'>
				Welcome back!
			</p>

			<p className='text-gray-200  text-[18px] max-[540px]:text-[16px] text-center'>
				Register your account to stay on top of your business.
			</p>
			<Card className='bg-neutral-900 py-7 px-7 w-[471px] mt-5 max-w-[500px] max-[370px]:px-5 max-[1120px]:w-[95%]'>
				<div className='flex flex-col gap-4'>
					<p className='text-white text-center'>Sign up with</p>
					<AuthSocialButtons />
					<div className='flex items-center gap-3'>
						<div className='h-[1px] bg-neutral-800 flex-1'></div>
						<p className='text-white text-center'>or</p>
						<div className='h-[1px] bg-neutral-800 flex-1'></div>
					</div>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col gap-5 justify-center'
				>
					<div className='flex gap-3 max-[540px]:flex-col'>
						<div className='flex flex-col flex-1 '>
							<p className='text-white mb-2'>Name</p>
							<Input
								placeholder='John'
								className='w-full text-white py-6'
								{...register('name', {
									required: 'Name is required',
									pattern: {
										value: /^[A-Za-z]{2,}$/,
										message:
											'Name must be at least 2 letters with no spaces or symbols',
									},
									minLength: {
										value: 5,
										message: 'Full name must be at least 5 characters long',
									},
									maxLength: {
										value: 100,
										message: 'Full name must be less than 100 characters',
									},
								})}
							/>
						</div>
						<div className='flex flex-col flex-1'>
							<p className='text-white mb-2'>Username</p>
							<Input
								placeholder='johnsmith'
								className='w-full text-white py-6'
								{...register('username', {
									required: 'Username is required',
									minLength: {
										value: 1,
										message: 'Username must be at least 1 character',
									},
									maxLength: {
										value: 39,
										message: 'Username must be at most 39 characters',
									},
									pattern: {
										value: /^(?!-)(?!.*--)[a-zA-Z0-9-]{1,39}(?<!-)$/,
										message:
											'Only letters, numbers, single hyphens. No leading/trailing hyphen or double hyphens',
									},
								})}
							/>
						</div>
					</div>
					<div className='flex flex-col'>
						<p className='text-white mb-2'>Email</p>
						<Input
							placeholder='Your email address'
							className='text-white py-6'
							{...register('email', {
								required: true,
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: 'Incorrect email',
								},
								maxLength: {
									value: 100,
									message: 'Email requires max 100 characters',
								},
							})}
						/>
					</div>
					<div className='flex gap-3 max-[540px]:flex-col'>
						<div className='flex flex-col'>
							<p className='text-white mb-2'>Password</p>
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
									type={showPassword ? 'text' : 'password'}
									placeholder='Your password'
									className='text-white py-6 pr-10'
									{...register('password', {
										required: true,
										minLength: {
											value: 10,
											message: 'Password requires min 10 characters',
										},
										pattern: {
											value:
												/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
											message:
												'Password must contain at least one latin letter, one digit, and one special character',
										},
									})}
								/>
							</div>
						</div>
						<div className='flex flex-col'>
							<p className='text-white mb-2'>Confirm password</p>
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
									type={showConfirmPassword ? 'text' : 'password'}
									placeholder='Confirm your password'
									className='text-white py-6 pr-10'
									{...register('passwordConfirm', {
										required: true,
										validate: (value) =>
											value === password || 'Passwords do not match',
									})}
								/>
							</div>
						</div>
					</div>
					<div className='flex items-center gap-3 max-[375px]:items-start'>
						<Controller
							name='termsAccepted'
							control={control}
							rules={{ required: 'You must agree to the terms and conditions' }}
							render={({ field }) => (
								<div className='flex items-center gap-3  pt-[1px] max-[375px]:items-start'>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										className='max-[375px]:mt-[4px]'
									/>
								</div>
							)}
						/>
						<p className='text-white'>I agree to the terms and conditions</p>
					</div>
					<Button
						disabled={isLoading}
						className='mt-1 font-bold text-[16px] py-5.5'
					>
						{isLoading ? (
							<Lottie
								animationData={loader}
								loop={true}
								className='w-24 h-24'
							/>
						) : (
							'Sign up'
						)}
					</Button>
					<div className='flex justify-center gap-1 max-[380px]:flex-col max-[380px]:items-center'>
						<p className='text-white text-center'> Already have an account? </p>

						<Link href={PAGES.LOGIN}>
							<span className='text-[color:var(--primary)] text-bold'>
								Log in here
							</span>
						</Link>
					</div>
				</form>
			</Card>
			<EmailVerificationForm
				open={isSuccessSignUp}
				onOpenChange={setIsSuccessSignUp}
				expiresAt={expiresAt}
				setExpiresAt={setExpiresAt}
				email={email}
			/>
		</div>
	)
}
