'use client'

import React, { useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import Lottie from 'lottie-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import loader from '@/assets/animations/loader.json'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useCountdown } from '@/hooks/auth/useCountDown'
import { emailVerificationSchema } from '@/schemas/auth/email-verify-schema'
import { authService } from '@/services/auth.service'
import type { IResendCodeResponse } from '@/types/auth.types'
import { formatTime } from '@/utils/format-time'
import { getValidationMessage } from '@/utils/validationMessage'

export type EmailVerificationFlow = 'signup' | 'email-change'

interface IEmailVerificationFormProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	expiresAt: Date | undefined
	setExpiresAt: (date: Date) => void
	email: string
	flow?: EmailVerificationFlow
	onVerified?: () => void
}

export function EmailVerificationForm({
	open,
	onOpenChange,
	expiresAt,
	setExpiresAt,
	email,
	flow: flowProp = 'signup',
	onVerified,
}: IEmailVerificationFormProps) {
	const t = useTranslations()
	const router = useRouter()
	const queryClient = useQueryClient()
	const [code, setCode] = useState('')
	const flow = flowProp

	const title =
		flow === 'signup'
			? t('emailVerification.title')
			: t('emailVerification.emailChangeTitle')
	const description =
		flow === 'signup'
			? t('emailVerification.description')
			: t('emailVerification.emailChangeDescription')
	const confirmLabel =
		flow === 'signup'
			? t('emailVerification.completeButton')
			: t('emailVerification.emailChangeConfirmButton')

	const { timeLeft } = useCountdown(expiresAt)
	const isResendDisabled = timeLeft > 0

	const { mutate: verifyEmail, isPending: isVerifying } = useMutation({
		mutationKey: ['verifyEmail', flow, email],
		mutationFn: (c: string) =>
			flow === 'signup'
				? authService.emailVerification({ code: c })
				: authService.verifyEmailChange({ email, code: c }),
		onSuccess: () => {
			if (flow === 'signup') {
				toast.success(t('success.registrationCompleted'))
				router.push(PAGES.LOGIN)
			} else {
				toast.success(t('success.emailUpdated'))
				void queryClient.invalidateQueries({ queryKey: ['getMe'] })
				setCode('')
				onOpenChange(false)
				onVerified?.()
			}
		},
		onError: () => {
			toast.error(
				flow === 'signup'
					? 'Invalid code. Try again'
					: t('errors.auth.invalidVerificationCode'),
			)
		},
	})

	const { mutate: resend, isPending: resendLoading } = useMutation({
		mutationKey: ['resendEmailCode', flow, email],
		mutationFn: (): Promise<IResendCodeResponse> =>
			flow === 'signup'
				? authService.resendCode({ email })
				: authService.resendEmailChange(email),
		onSuccess: (data: IResendCodeResponse) => {
			setExpiresAt(new Date(data.expiresAt as unknown as string | number | Date))
		},
		onError: (error: unknown) => {
			const err = error as {
				response?: { status?: number; data?: { code?: string; expiresAt?: string } }
			}
			const data = err.response?.data
			const errCode = data?.code
			if (err.response?.status === 409 && data?.expiresAt) {
				setExpiresAt(new Date(data.expiresAt))
			}
			if (errCode) {
				toast.error(t(`errors.${errCode}`, data as Record<string, string>))
			} else {
				toast.error(t('errors.auth.invalidVerificationCode'))
			}
		},
	})

	const handleEmailVerification = () => {
		const result = emailVerificationSchema.safeParse({ code })

		if (!result.success) {
			const message = result.error.issues[0]?.message || 'Invalid code'
			toast.error(getValidationMessage(message, t))
			return
		}

		verifyEmail(result.data.code)
	}

	const handleResendCode = () => {
		resend()
	}

	useEffect(() => {
		if (!open) setCode('')
	}, [open])

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='border-border bg-card text-card-foreground sm:max-w-md'>
				<DialogHeader className='flex-col gap-3 text-start'>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
					<Input
						value={code}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setCode(e.target.value)
						}
						placeholder={t('emailVerification.codePlaceholder')}
						className='uppercase placeholder:normal-case bg-background border-border text-foreground placeholder:text-muted-foreground'
					/>
					<div className='flex gap-3 justify-between items-center'>
						<div className='flex gap-3 items-center max-[430px]:flex-col w-full'>
							<Button
								type='button'
								onClick={handleEmailVerification}
								className='max-w-[190px] font-bold max-[430px]:max-w-none max-[430px]:w-full'
								disabled={code.trim().length === 0 || isVerifying}
							>
								{confirmLabel}
							</Button>
							<div className='flex items-center w-full justify-between'>
								<Button
									type='button'
									onClick={handleResendCode}
									className='relative w-[140px] font-bold max-[430px]:w-full'
									disabled={isResendDisabled || resendLoading}
								>
									{resendLoading ? (
										<Lottie
											animationData={loader}
											loop={true}
											className='absolute w-20 h-20'
										/>
									) : (
										<div className='flex items-center justify-center gap-1'>
											<div className='flex items-center'>
												<span>{t('emailVerification.resendButton')}</span>
												{isResendDisabled && (
													<span
														aria-live='polite'
														className='text-sm w-[50px] min-[430px]:hidden'
													>
														{formatTime(timeLeft)}
													</span>
												)}
											</div>
										</div>
									)}
								</Button>

								<div className='max-[430px]:hidden'>
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
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
