'use client'
import { AuthSocialButtons } from '@/components/ui/AuthSocialButtons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useLogIn } from '@/hooks/auth/useLogIn'
import { ILogInFormData } from '@/types/auth.types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsFillEyeSlashFill } from 'react-icons/bs'
import { HiEye } from 'react-icons/hi'
import { toast } from 'sonner'

export function LogInForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILogInFormData>({ reValidateMode: 'onSubmit' })
	const [showPassword, setShowPassword] = useState(false)
	const { logIn } = useLogIn()

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword)
	}

	const onSubmit: SubmitHandler<ILogInFormData> = data => {
		const logInData = {
			email: data.email,
			password: data.password,
		}
		logIn(logInData)
	}

	useEffect(() => {
		if (errors.email?.message) {
			toast(errors.email.message)
		}
		if (errors.password?.message) {
			toast(errors.password.message)
		}
	}, [errors.email, errors.password])

	return (
		<div className='mt-20 flex flex-col items-center max-[1120px]:w-screen px-3'>
			<p className='text-white font-bold text-[30px] max-[540px]:text-[24px]'>
				Welcome back!
			</p>

			<p className='text-gray-200  text-[18px] max-[540px]:text-[16px] text-center'>
				Log in to stay connected and manage your business.
			</p>
			<Card className='bg-neutral-900 py-7 px-7 w-[471px] mt-5 max-w-[500px] max-[370px]:px-5 max-[1120px]:w-[95%]'>
				<div className='flex flex-col gap-4'>
					<p className='text-white text-center'>Log in with</p>
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
								})}
							/>
						</div>
					</div>
					<Link href={PAGES.FORGOT_PASSWORD} className='cursor-pointer'>
						Forgot password?
					</Link>

					<Button className='mt-1 font-bold text-[16px] py-5.5'>Log in</Button>
					<div className='flex justify-center gap-1 max-[380px]:flex-col max-[380px]:items-center'>
						<p className='text-white text-center'> Don't have an account? </p>

						<Link href={PAGES.SIGNUP}>
							<span className='text-[color:var(--primary)] text-bold'>
								Sign up here
							</span>
						</Link>
					</div>
				</form>
			</Card>
		</div>
	)
}
