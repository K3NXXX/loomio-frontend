'use client'
import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import Lottie from 'lottie-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import loader from '@/assets/animations/loader.json'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useCountdown } from '@/hooks/auth/useCountDown'
import { useForgotPassword } from '@/hooks/auth/useForgotPassword'
import { forgotPasswordSchema } from '@/schemas/auth/forgot-password-schema'
import { FORGOT_PASSWORD_STEPS } from '@/types/auth.types'
import { formatTime } from '@/utils/format-time'

import type { TForgotPasswordSchema } from '@/schemas/auth/forgot-password-schema'
import type { SubmitHandler } from 'react-hook-form'

export function ForgotPassword() {
	const [step, setStep] = useState(FORGOT_PASSWORD_STEPS.FIRST)

	const { forgotPassword, loading, expiresAt } = useForgotPassword(setStep)
	const { timeLeft } = useCountdown(expiresAt)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TForgotPasswordSchema>({
		reValidateMode: 'onSubmit',
		resolver: zodResolver(forgotPasswordSchema),
	})

	const isResendDisabled = timeLeft > 0

	const onSubmit: SubmitHandler<TForgotPasswordSchema> = (data) => {
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
					{step === FORGOT_PASSWORD_STEPS.FIRST && (
						<div className='flex flex-col'>
							<p className='font-bold text-[24px] max-[450px]:text-[20px]'>
								Please enter your email
							</p>
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
									placeholder='Your email address'
									className='text-white py-5'
									aria-label='email'
									{...register('email')}
								/>
								<div className='flex justify-between items-center  pt-2'>
									<div className='flex gap-3'>
										<Button
											disabled={isResendDisabled}
											className='mt-1 font-bold text-[14px] py-3 w-[90px]'
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
					{step === FORGOT_PASSWORD_STEPS.SECOND && (
						<div className='flex flex-col'>
							<p className='font-bold text-[24px]  max-[450px]:text-[20px]'>
								Please check your email
							</p>
							<p className='text-neutral-400 text-[14px] max-w-[400px] mb-5'>
								We’ve sent a password reset link to your email address. Please
								check your inbox and follow the instructions to reset your
								password. If you don’t see the email, check your spam or junk
								folder.
							</p>
							<div className='flex gap-3'>
								<Link href={PAGES.LOGIN}>
									<Button className='mt-1 font-bold text-[14px] py-3 max-w-[100px]'>
										Close
									</Button>
								</Link>
								<Button
									onClick={() => setStep(FORGOT_PASSWORD_STEPS.FIRST)}
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
