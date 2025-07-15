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
import { useEffect, useState } from 'react'

interface IEmailVerificationFormProps {
	open: boolean
	onOpenChange: (isSuccessSignUp: boolean) => void
	expiresAt: number
	email: string
}

export function EmailVerificationForm({
	open,
	onOpenChange,
	expiresAt,
	email,
}: IEmailVerificationFormProps) {
	const [code, setCode] = useState('')
	const { confirmEmail } = useEmailVerification()
	const [, forceUpdate] = useState(0)
	const { resendCode, expiresAtResend } = useResendCode()

	const isResendDisabled = Date.now() < new Date(expiresAt).getTime()

	useEffect(() => {
		const interval = setInterval(() => {
			forceUpdate(prev => prev + 1)
		}, 1000)

		if (Date.now() > new Date(expiresAt).getTime()) {
			clearInterval(interval)
		}

		return () => clearInterval(interval)
	}, [expiresAt])

	const handleEmailVerification = () => {
		confirmEmail({ code })
	}

	const handleResendCode = () => {
		resendCode({ email: email })
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
					<div className='flex gap-3'>
						<Button
							onClick={handleEmailVerification}
							className='max-w-[170px] font-bold'
						>
							Complete registration
						</Button>
						<Button
							onClick={() => handleResendCode()}
							className='bg-neutral-700'
							disabled={isResendDisabled}
						>
							Resend code
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
