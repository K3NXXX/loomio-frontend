'use client'
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import Lottie from 'lottie-react'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'

import loader from '@/assets/animations/loader.json'
import { AuthSocialButtons } from '@/components/ui/AuthSocialButtons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PAGES } from '@/constants/pages.constants'
import { useSignUp } from '@/hooks/auth/useSignUp'
import { signupSchema } from '@/schemas/auth/signup-schema'

import { EmailVerificationForm } from '../EmailVerificationForm'

import { SignUpFormFields } from './SignUpFormFields'

import type { TSignupSchema } from '@/schemas/auth/signup-schema'
import type { SubmitHandler } from 'react-hook-form'

export function SignUpForm() {
	const [email, setEmail] = useState('')

	const {
		signUp,
		isSuccessSignUp,
		setIsSuccessSignUp,
		isLoading,
		expiresAt,
		setExpiresAt,
	} = useSignUp()

	const methods = useForm<TSignupSchema>({
		reValidateMode: 'onSubmit',
		resolver: zodResolver(signupSchema),
		defaultValues: {
			termsAccepted: false,
		},
	})

	const onSubmit: SubmitHandler<TSignupSchema> = (data) => {
		const signUpData = {
			email: data.email,
			password: data.password,
			confirmPassword: data.passwordConfirm,
			name: data.name,
			username: data.username,
		}
		signUp(signUpData)
		setEmail(data.email)
	}

	return (
		<div className='mt-20 flex flex-col items-center max-[1120px]:w-screen px-3'>
			<p className='text-white font-bold text-[30px] max-[540px]:text-[24px]'>
				Welcome back!
			</p>

			<p className='text-gray-200  text-[18px] max-[540px]:text-[16px] text-center'>
				Register your account to stay on top of your business.
			</p>
			<Card className='bg-neutral-900 py-7 px-7 w-[471px] mt-5 max-w-[500px] max-[370px]:px-5 max-[1120px]:w-[95%]'>
				<div className='flex flex-col gap-4'>
					<p className='text-white text-center'>Sign up with</p>
					<AuthSocialButtons />
					<div className='flex items-center gap-3'>
						<div className='h-[1px] bg-neutral-800 flex-1'></div>
						<p className='text-white text-center'>or</p>
						<div className='h-[1px] bg-neutral-800 flex-1'></div>
					</div>
				</div>
				<FormProvider {...methods}>
					<form
						onSubmit={methods.handleSubmit(onSubmit)}
						className='flex flex-col gap-5 justify-center'
					>
						<SignUpFormFields />
						<Button
							disabled={isLoading}
							className='mt-1 font-bold text-[16px] py-5.5'
						>
							{isLoading ? (
								<Lottie
									animationData={loader}
									loop={true}
									className='w-24 h-24'
								/>
							) : (
								'Sign up'
							)}
						</Button>
						<div className='flex justify-center gap-1 max-[380px]:flex-col max-[380px]:items-center'>
							<p className='text-white text-center'>
								{' '}
								Already have an account?{' '}
							</p>

							<Link href={PAGES.LOGIN}>
								<span className='text-[color:var(--primary)] text-bold'>
									Log in here
								</span>
							</Link>
						</div>
					</form>
				</FormProvider>
			</Card>
			<EmailVerificationForm
				open={isSuccessSignUp}
				onOpenChange={setIsSuccessSignUp}
				expiresAt={expiresAt}
				setExpiresAt={setExpiresAt}
				email={email}
			/>
		</div>
	)
}
