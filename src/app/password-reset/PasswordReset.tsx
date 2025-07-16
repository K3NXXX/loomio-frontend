'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useResetPassword } from '@/hooks/auth/useResetPassword'
import { IResetPasswordFormData } from '@/types/auth.types'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsFillEyeSlashFill } from 'react-icons/bs'
import { HiEye } from 'react-icons/hi'
import { toast } from 'sonner'

export default  function PasswordReset() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<IResetPasswordFormData>({ reValidateMode: 'onSubmit' })

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const { resetPassword } = useResetPassword()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const password = watch('password')

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword)
	}

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword)
	}

	const onSubmit: SubmitHandler<IResetPasswordFormData> = data => {
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
		if (errors.password?.message) {
			toast(errors.password.message)
		}
		if (errors.confirmPassword?.message) {
			toast(errors.confirmPassword.message)
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
						<p className='font-bold text-[24px]'>Create a new password</p>
						<p className='text-neutral-400 text-[14px] max-w-[400px] mb-5'>
							Create a new password for your account. Make sure it’s strong and
							unique to keep your account secure.
						</p>
						<form
							className='flex flex-col gap-4'
							onSubmit={handleSubmit(onSubmit)}
						>
							<div className='flex flex-col'>
								<p className='text-white mb-2'>Password</p>
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
										type={showPassword ? 'text' : 'password'}
										placeholder='Your password'
										className='text-white py-5 pr-10'
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
										type={showConfirmPassword ? 'text' : 'password'}
										placeholder='Confirm your password'
										className='text-white py-5 pr-10'
										{...register('confirmPassword', {
											required: true,
											validate: value =>
												value === password || 'Passwords do not match',
										})}
									/>
								</div>
							</div>
							<div className='flex gap-3 pt-2'>
								<Button className='mt-1 font-bold text-[14px] py-3 w-[90px]'>
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
