'use client'
import { AuthThemeConfiguratorFab } from '@/components/auth/AuthThemeConfiguratorFab'
import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import Lottie from 'lottie-react'
import { useTranslations } from 'next-intl'
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
import { getValidationMessage } from '@/utils/validationMessage'

import type { TForgotPasswordSchema } from '@/schemas/auth/forgot-password-schema'
import type { SubmitHandler } from 'react-hook-form'

export function ForgotPassword() {
	const t = useTranslations()
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
			toast(getValidationMessage(errors.email.message, t))
		}
	}, [errors.email, t])

	return (
		<div className='w-full min-h-screen bg-gradient-to-br from-background via-muted/30 to-background text-foreground'>
			<div className='mx-auto max-w-[1200px] px-5 pb-10'>
				<div className='flex justify-center py-10'>
					{step === FORGOT_PASSWORD_STEPS.FIRST && (
						<div className='flex flex-col'>
							<p className='font-bold text-[24px] max-[450px]:text-[20px] text-foreground'>
								{t('auth.forgotPassword.step1.title')}
							</p>
							<p className='text-muted-foreground text-[14px] max-w-[400px] mb-5'>
								{t('auth.forgotPassword.step1.description')}
							</p>
							<form
								className='flex flex-col gap-2'
								onSubmit={handleSubmit(onSubmit)}
							>
								<Input
									autoFocus
									placeholder={t('auth.forgotPassword.step1.emailPlaceholder')}
									className='py-5 bg-background border-border text-foreground placeholder:text-muted-foreground'
									aria-label='email'
									{...register('email')}
								/>
								<div className='flex justify-between items-center  pt-2'>
									<div className='flex gap-3'>
										<Button
											type='submit'
											disabled={isResendDisabled}
											className='mt-1 font-bold text-[14px] py-2 px-5 w-[120px]'
										>
											{loading ? (
												<Lottie
													animationData={loader}
													loop={true}
													className='absolute w-20 h-20'
												/>
											) : (
												t('auth.forgotPassword.step1.confirm')
											)}
										</Button>
										<Link href={PAGES.LOGIN}>
											<Button
												type='button'
												variant='secondary'
												className='mt-1 font-bold text-[14px] py-3'
											>
												{t('auth.forgotPassword.step1.return')}
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
							<p className='font-bold text-[24px] max-[450px]:text-[20px] text-foreground'>
								{t('auth.forgotPassword.step2.title')}
							</p>
							<p className='text-muted-foreground text-[14px] max-w-[400px] mb-5'>
								{t('auth.forgotPassword.step2.description')}
							</p>
							<div className='flex gap-3'>
								<Link href={PAGES.LOGIN}>
									<Button
										type='button'
										className='mt-1 font-bold text-[14px] py-3 max-w-[100px]'
									>
										{t('auth.forgotPassword.step2.close')}
									</Button>
								</Link>
								<Button
									type='button'
									variant='secondary'
									onClick={() => setStep(FORGOT_PASSWORD_STEPS.FIRST)}
									className='mt-1 font-bold text-[14px] py-3 w-[150px]'
								>
									{t('auth.forgotPassword.step2.startOver')}
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
			<AuthThemeConfiguratorFab />
		</div>
	)
}
