'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BsFillEyeSlashFill } from 'react-icons/bs'
import { HiEye } from 'react-icons/hi'

import { AuthSocialButtons } from '@/components/ui/AuthSocialButtons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useLogIn } from '@/hooks/auth/useLogIn'
import { useLoginFormErrors } from '@/hooks/auth/useLoginFormErrors'
import { loginSchema } from '@/schemas/auth/login-schema'

import type { TLoginSchema } from '@/schemas/auth/login-schema'
import type { SubmitHandler } from 'react-hook-form'
import { FaRecordVinyl } from 'react-icons/fa6'

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

	const onSubmit: SubmitHandler<TLoginSchema> = (data) => {
		logIn({ identifier: data.identifier, password: data.password })
	}

	return (
		<div className='relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-neutral-900 to-black'>
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/20 blur-3xl rounded-full'></div>
			<div className='absolute bottom-0 right-1/2 translate-x-1/2 w-[300px] h-[300px] bg-purple-500/10 blur-3xl rounded-full'></div>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4 }}
				className='w-full max-w-md bg-neutral-900/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-neutral-800'
			>
				<div className='flex flex-col items-center mb-6'>
					<div className='w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md'>
						<FaRecordVinyl className='text-primary-foreground' />
					</div>
					<h1 className='text-white text-2xl font-bold mt-4'>
						Log in to Loomio
					</h1>
					<p className='text-gray-400 text-sm mt-1 text-center'>
						Your gateway to endless streaming.
					</p>
				</div>

				<AuthSocialButtons />
				<div className='flex items-center gap-3 my-5'>
					<div className='h-[1px] bg-neutral-700 flex-1'></div>
					<p className='text-gray-400 text-xs uppercase'>or</p>
					<div className='h-[1px] bg-neutral-700 flex-1'></div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
					<div className='flex flex-col'>
						<label htmlFor='login-identifier' className='text-white mb-2'>
							Email or username
						</label>
						<Input
							id='login-identifier'
							placeholder='example@mail.com'
							className='w-full text-white py-6'
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
									onClick={() => setShowPassword(!showPassword)}
									className='absolute top-[17px] right-[15px] cursor-pointer'
									color='white'
								/>
							) : (
								<BsFillEyeSlashFill
									onClick={() => setShowPassword(!showPassword)}
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

					<Link
						href={PAGES.FORGOT_PASSWORD}
						className='text-xs font-bold text-primary hover:text-primary/80 self-end'
					>
						Forgot password?
					</Link>

					<Button
						type='submit'
						className='
              bg-primary 
              hover:bg-primary/90 
              text-primary-foreground 
              font-semibold text-lg py-6 rounded-xl
              shadow-md hover:shadow-lg
              active:scale-[0.98]
              transition-all
            '
					>
						Log In
					</Button>

					<p className='text-gray-400 text-sm text-center mt-3'>
						Don&apos;t have an account?{' '}
						<Link
							href={PAGES.SIGNUP}
							className='text-primary hover:text-primary/80 font-medium'
						>
							Sign up
						</Link>
					</p>
				</form>
			</motion.div>
		</div>
	)
}
