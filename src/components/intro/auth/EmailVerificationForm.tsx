import React, { useEffect, useState } from 'react'

import Lottie from 'lottie-react'
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
import { useCountdown } from '@/hooks/auth/useCountDown'
import { useEmailVerification } from '@/hooks/auth/useEmailVerification'
import { useResendCode } from '@/hooks/auth/useResendCode'
import { emailVerificationSchema } from '@/schemas/auth/email-verify-schema'
import { formatTime } from '@/utils/format-time'

interface IEmailVerificationFormProps {
	open: boolean
	onOpenChange: (isSuccessSignUp: boolean) => void
	expiresAt: Date | undefined
	setExpiresAt: (date: Date) => void
	email: string
}

export function EmailVerificationForm({
	open,
	onOpenChange,
	expiresAt,
	setExpiresAt,
	email,
}: IEmailVerificationFormProps) {
	const [code, setCode] = useState('')

	const { confirmEmail } = useEmailVerification()
	const { resendCode, expiresAtResend, loading } = useResendCode()
	const { timeLeft } = useCountdown(expiresAt)

	const isResendDisabled = timeLeft > 0

	const handleEmailVerification = () => {
		const result = emailVerificationSchema.safeParse({ code })

		if (!result.success) {
			const message = result.error.issues[0]?.message || 'Invalid code'
			toast.error(message)
			return
		}

		confirmEmail({ code: result.data.code })
	}

	const handleResendCode = () => {
		resendCode({ email })
	}

	useEffect(() => {
		if (expiresAtResend) {
			setExpiresAt(new Date(expiresAtResend))
		}
	}, [expiresAtResend, setExpiresAt])

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader className='flex-col gap-3 text-start'>
					<DialogTitle className=''>Email verification</DialogTitle>
					<DialogDescription>
						We have sent a verification code to your email address. Please check
						your inbox and enter the code to continue.
					</DialogDescription>
					<Input
						value={code}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setCode(e.target.value)
						}
						placeholder='Your verification code here'
						className='uppercase placeholder:normal-case'
					/>
					<div className='flex gap-3 justify-between items-center'>
						<div className='flex gap-3 items-center max-[430px]:flex-col w-full '>
							<Button
								onClick={handleEmailVerification}
								className='max-w-[170px] font-bold max-[430px]:max-w-none max-[430px]:w-full'
								disabled={code.trim().length === 0}
							>
								Complete registration
							</Button>
							<div className='flex items-center w-full justify-between'>
								<Button
									onClick={handleResendCode}
									className='relative w-[113px] font-bold max-[430px]:w-full'
									disabled={isResendDisabled}
								>
									{loading ? (
										<Lottie
											animationData={loader}
											loop={true}
											className='absolute w-20 h-20'
										/>
									) : (
										<div className='flex items-center justify-center gap-1'>
											<div className='flex items-center'>
												<span className=''>Resend code</span>
												{isResendDisabled && (
													<span
														aria-live='polite'
														className='text-sm w-[50px]  min-[430px]:hidden'
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
