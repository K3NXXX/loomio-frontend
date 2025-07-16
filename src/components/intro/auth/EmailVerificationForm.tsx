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
import { useEmailVerification } from '@/hooks/auth/useEmailVerification'
import { useResendCode } from '@/hooks/auth/useResendCode'
import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

interface IEmailVerificationFormProps {
	open: boolean
	onOpenChange: (isSuccessSignUp: boolean) => void
	expiresAt: Date | undefined
	setExpiresAt: (date: Date) => void
	email: string
}

function formatTime(ms: number): string {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000))
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60
	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`
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
	const [timeLeft, setTimeLeft] = useState(0)

	useEffect(() => {
		if (expiresAt) {
			const updateTimer = () => {
				const diff = new Date(expiresAt).getTime() - Date.now()
				setTimeLeft(Math.max(0, diff))
			}

			updateTimer()
			const interval = setInterval(updateTimer, 1000)
			return () => clearInterval(interval)
		}
	}, [expiresAt])

	useEffect(() => {
		if (expiresAtResend) {
			setExpiresAt(new Date(expiresAtResend))
		}
	}, [expiresAtResend, setExpiresAt])

	const isResendDisabled = timeLeft > 0

	const handleEmailVerification = () => {
		confirmEmail({ code })
	}

	const handleResendCode = () => {
		resendCode({ email })
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader className='flex-col gap-3'>
					<DialogTitle>Email verification</DialogTitle>
					<DialogDescription>
						We have sent a verification code to your email address. Please check
						your inbox and enter the code to continue.
					</DialogDescription>
					<Input
						value={code}
						onChange={e => setCode(e.target.value)}
						placeholder='Your verification code here'
						className='uppercase placeholder:normal-case'
					/>
					<div className='flex gap-3 justify-between items-center'>
						<div className='flex gap-3 items-center'>
							<Button
								onClick={handleEmailVerification}
								className='max-w-[170px] font-bold'
							>
								Complete registration
							</Button>
							<Button
								onClick={handleResendCode}
								className='relative w-[113px] bg-neutral-700'
								disabled={isResendDisabled}
							>
								{loading ? (
									<Lottie
										animationData={loader}
										loop={true}
										className='absolute w-20 h-20'
									/>
								) : (
									'Resend code'
								)}
							</Button>
						</div>
						<div>
							{isResendDisabled && (
								<span className='text-sm text-muted-foreground w-[50px]'>
									{formatTime(timeLeft)}
								</span>
							)}
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
