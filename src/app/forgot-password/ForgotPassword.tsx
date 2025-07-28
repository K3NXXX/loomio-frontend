'use client'
import loader from '@/assets/animations/loader.json'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useCountdown } from '@/hooks/auth/useCountDown'
import { useForgotPassword } from '@/hooks/auth/useForgotPassword'
import { IForgotPasswordFormData } from '@/types/auth.types'
import { formatTime } from '@/utils/format-time'
import Lottie from 'lottie-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function ForgotPassword() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IForgotPasswordFormData>({ reValidateMode: 'onSubmit' })

	const [step, setStep] = useState(1)

	const { forgotPassword, loading, expiresAt } = useForgotPassword(setStep)
	const { timeLeft } = useCountdown(expiresAt)

	const isResendDisabled = timeLeft > 0

	const onSubmit: SubmitHandler<IForgotPasswordFormData> = data => {
		forgotPassword({ email: data.email })
	}

	useEffect(() => {
		if (errors.email?.message) {
			toast(errors.email.message)
		}
	}, [errors.email])

	return (
		<div
			style={{
				background: 'linear-gradient(250deg, #202020 0%, transparent 50%)',
			}}
			className='w-full'
		>
			<div className='min-h-screen mx-auto max-w-[1200px] px-5 pb-10'>
				<div className='flex justify-center py-10'>
					{step === 1 && (
						<div className='flex flex-col'>
							<p className='font-bold text-[24px]'>Please enter your email</p>
							<p className=' text-neutral-400 text-[14px] max-w-[400px] mb-5'>
								We’ll send you a link to reset your password. Make sure you
								enter the email you used to register.
							</p>
							<form
								className='flex flex-col gap-2'
								onSubmit={handleSubmit(onSubmit)}
							>
								<Input
									autoFocus
									type='email'
									placeholder='Your email address'
									className='text-white py-5'
									aria-invalid={!!errors.email}
									aria-describedby={errors.email ? 'email-error' : undefined}
									{...register('email', {
										required: { value: true, message: 'Email is required' },
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
								<div className='flex justify-between items-center'>
									<div className='flex gap-3 pt-2'>
										<Button
											disabled={isResendDisabled}
											className='mt-1 font-bold text-[14px] py-3 w-[90px]'
											aria-busy={loading}
										>
											{loading ? (
												<Lottie
													animationData={loader}
													loop={true}
													className='absolute w-20 h-20'
												/>
											) : (
												'Confirm'
											)}
										</Button>
										<Link href={PAGES.LOGIN}>
											<Button className='bg-neutral-700 mt-1 font-bold text-[14px] py-3'>
												Return
											</Button>
										</Link>
									</div>

									<div>
										{isResendDisabled && (
											<span
												aria-live='polite'
												className='text-sm text-muted-foreground w-[50px]'
											>
												{formatTime(timeLeft)}
											</span>
										)}
									</div>
								</div>
							</form>
						</div>
					)}
					{step === 2 && (
						<div className='flex flex-col'>
							<p className='font-bold text-[24px]'>Please check your email</p>
							<p className='text-neutral-400 text-[14px] max-w-[400px] mb-5'>
								We’ve sent a password reset link to your email address. Please
								check your inbox and follow the instructions to reset your
								password. If you don’t see the email, check your spam or junk
								folder.
							</p>
							<div className='flex gap-3'>
								<Link href={PAGES.LOGIN}>
									<Button
										onClick={() => setStep(1)}
										className='mt-1 font-bold text-[14px] py-3 max-w-[100px]'
									>
										Close
									</Button>
								</Link>
								<Button
									onClick={() => setStep(1)}
									className='bg-neutral-700 mt-1 font-bold text-[14px] py-3 max-w-[100px]'
								>
									Start over
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
