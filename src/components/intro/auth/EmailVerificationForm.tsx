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
import { useEffect, useState } from 'react'

interface IEmailVerificationFormProps {
	open: boolean
	onOpenChange: (isSuccessSignUp: boolean) => void
	retryAfter: number
}

export function EmailVerificationForm({
	open,
	onOpenChange,
	retryAfter,
}: IEmailVerificationFormProps) {
	const [code, setCode] = useState('')
	const [timer, setTimer] = useState(retryAfter)
	const { confirmEmail } = useEmailVerification()

	const handleEmailVerification = () => {
		confirmEmail({ code: code })
	}

	const handleResendCode = () => {
		setTimer(retryAfter)
	}

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null
		if (open) {
			setTimer(retryAfter)
			interval = setInterval(() => {
				setTimer(prev => {
					if (prev <= 1 && interval) {
						clearInterval(interval)
						return 0
					}
					return prev - 1
				})
			}, 1000)
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [open, retryAfter])

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
							onClick={() => handleEmailVerification()}
							className='max-w-[170px] font-bold'
						>
							Complete registration
						</Button>
						<Button
							className='bg-neutral-700'
							onClick={handleResendCode}
							disabled={timer > 0}
						>
							{timer > 0 ? `Resend in ${timer}s` : 'Resend code'}
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
