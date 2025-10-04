'use client'
import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { BsFillEyeSlashFill } from 'react-icons/bs'
import { HiEye } from 'react-icons/hi'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useResetPassword } from '@/hooks/auth/useResetPassword'
import { resetPasswordSchema } from '@/schemas/auth/reset-password-schema'

import type { TResetPasswordSchema } from '@/schemas/auth/reset-password-schema'
import type { SubmitHandler } from 'react-hook-form'

export default function PasswordReset() {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const searchParams = useSearchParams()

	const { resetPassword } = useResetPassword()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TResetPasswordSchema>({
		reValidateMode: 'onSubmit',
		resolver: zodResolver(resetPasswordSchema),
	})

	const token = searchParams.get('token')

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword)
	}

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword)
	}

	const onSubmit: SubmitHandler<TResetPasswordSchema> = (data) => {
		if (!token) {
			toast.error('Invalid or missing token.')
			return
		}
		const resetPasswordData = {
			password: data.password,
			confirmPassword: data.confirmPassword,
			token,
		}
		resetPassword(resetPasswordData)
	}

	useEffect(() => {
		if (errors.confirmPassword?.message) {
			toast.error(errors.confirmPassword.message)
		}
		if (errors.password?.message) {
			toast.error(errors.password.message)
		}
	}, [errors.password, errors.confirmPassword])

	return (
		<div
			style={{
				background: 'linear-gradient(250deg, #202020 0%, transparent 50%)',
			}}
			className='w-full'
		>
			<div className='min-h-screen mx-auto max-w-[1200px] px-5 pb-10'>
				<div className='flex justify-center py-10'>
					<div className='flex flex-col'>
						<p className='font-bold text-[24px]  max-[450px]:text-[20px]'>
							Create a new password
						</p>
						<p className='text-neutral-400 text-[14px] max-w-[400px] mb-5'>
							Create a new password for your account. Make sure it’s strong and
							unique to keep your account secure.
						</p>
						<form
							className='flex flex-col gap-4'
							onSubmit={handleSubmit(onSubmit)}
						>
							<div className='flex flex-col'>
								<label htmlFor='reset-password' className='text-white mb-2'>
									Password
								</label>
								<div className='relative'>
									{showPassword ? (
										<HiEye
											onClick={handleClickShowPassword}
											className='absolute top-[13px] right-[15px] cursor-pointer'
											color='white'
										/>
									) : (
										<BsFillEyeSlashFill
											onClick={handleClickShowPassword}
											className='absolute top-[13px] right-[15px] cursor-pointer'
											color='white'
										/>
									)}
									<Input
										id='reset-password'
										type={showPassword ? 'text' : 'password'}
										placeholder='Your password'
										className='text-white py-5 pr-10'
										{...register('password')}
									/>
								</div>
							</div>
							<div className='flex flex-col'>
								<label
									htmlFor='reset-password-confirm'
									className='text-white mb-2'
								>
									Confirm password
								</label>
								<div className='relative'>
									{showConfirmPassword ? (
										<HiEye
											onClick={handleClickShowConfirmPassword}
											className='absolute top-[13px] right-[15px] cursor-pointer'
											color='white'
										/>
									) : (
										<BsFillEyeSlashFill
											onClick={handleClickShowConfirmPassword}
											className='absolute top-[13px] right-[15px] cursor-pointer'
											color='white'
										/>
									)}
									<Input
										id='reset-password-confirm'
										type={showConfirmPassword ? 'text' : 'password'}
										placeholder='Confirm your password'
										className='text-white py-5 pr-10'
										{...register('confirmPassword')}
									/>
								</div>
							</div>
							<div className='flex gap-3 pt-2'>
								<Button className='mt-1 font-bold text-[14px] py-3 w-[90px] bg-primary '>
									Confirm
								</Button>
								<Link href={PAGES.FORGOT_PASSWORD}>
									<Button className='bg-neutral-700 mt-1 font-bold text-[14px] py-3'>
										Return
									</Button>
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}
