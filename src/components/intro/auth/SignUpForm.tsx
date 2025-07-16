'use client'
import loader from '@/assets/animations/loader.json'
import { AuthSocialButtons } from '@/components/ui/AuthSocialButtons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useSignUp } from '@/hooks/auth/useSignUp'
import { ISignupFormData } from '@/types/auth.types'
import Lottie from 'lottie-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { BsFillEyeSlashFill } from 'react-icons/bs'
import { HiEye } from 'react-icons/hi'
import { toast } from 'sonner'
import { EmailVerificationForm } from './EmailVerificationForm'

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

	const onSubmit: SubmitHandler<ISignupFormData> = data => {
		const signUpData = {
			email: data.email,
			password: data.password,
			confirmPassword: data.passwordConfirm,
			firstName: data.firstName,
			lastName: data.lastName,
		}
		signUp(signUpData)
		setEmail(data.email)
	}

	useEffect(() => {
		if (errors.firstName?.message) {
			toast(errors.firstName.message)
		}
		if (errors.lastName?.message) {
			toast(errors.lastName.message)
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
		errors.firstName,
		errors.lastName,
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
							<p className='text-white mb-2'>First name</p>
							<Input
								placeholder='Your first name'
								className='w-full text-white py-6'
								{...register('firstName', {
									required: true,
									minLength: {
										value: 3,
										message: 'First name requires min 3 characters',
									},
									maxLength: {
										value: 50,
										message: 'First name requires max 50 characters',
									},
									pattern: {
										value: /^[a-zA-Z]+$/,
										message: 'Only English letters are allowed in first name',
									},
								})}
							/>
						</div>
						<div className='flex flex-col flex-1'>
							<p className='text-white mb-2'>Last name</p>
							<Input
								placeholder='Your last name'
								className='w-full text-white py-6'
								{...register('lastName', {
									required: true,
									minLength: {
										value: 3,
										message: 'Last name requires min 3 characters',
									},
									maxLength: {
										value: 50,
										message: 'Last name requires max 50 characters',
									},
									pattern: {
										value: /^[a-zA-Z]+$/,
										message: 'Only English letters are allowed in last name',
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
										validate: value =>
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
