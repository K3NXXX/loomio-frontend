'use client'
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { BsFillEyeSlashFill } from 'react-icons/bs'
import { HiEye } from 'react-icons/hi'

import { AuthSocialButtons } from '@/components/ui/AuthSocialButtons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useLogIn } from '@/hooks/auth/useLogIn'
import { useLoginFormErrors } from '@/hooks/auth/useLoginFormErrors'
import { loginSchema } from '@/schemas/auth/login-schema'

import type { TLoginSchema } from '@/schemas/auth/login-schema'
import type { SubmitHandler } from 'react-hook-form'

export function LogInForm() {
	const [showPassword, setShowPassword] = useState(false)

	const { logIn } = useLogIn()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TLoginSchema>({
		reValidateMode: 'onSubmit',
		resolver: zodResolver(loginSchema),
	})
	useLoginFormErrors(errors)

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword)
	}

	const onSubmit: SubmitHandler<TLoginSchema> = (data) => {
		const logInData = {
			identifier: data.identifier,
			password: data.password,
		}
		logIn(logInData)
	}

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
						<label htmlFor='login-identifier' className='text-white mb-2'>
							Email or username
						</label>
						<Input
							id='login-identifier'
							placeholder='Your email address or username'
							className='text-white py-6'
							{...register('identifier')}
						/>
					</div>
					<div className='flex flex-col'>
						<label htmlFor='login-password' className='text-white mb-2'>
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
								id='login-password'
								type={showPassword ? 'text' : 'password'}
								placeholder='Your password'
								className='text-white py-6 pr-10'
								{...register('password')}
							/>
						</div>
					</div>
					<Link href={PAGES.FORGOT_PASSWORD} className='cursor-pointer'>
						Forgot password?
					</Link>

					<Button className='mt-1 font-bold text-[16px] py-5.5'>Log in</Button>
					<div className='flex justify-center gap-1 max-[380px]:flex-col max-[380px]:items-center'>
						<p className='text-white text-center'>{`Don't have an account?`}</p>

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
