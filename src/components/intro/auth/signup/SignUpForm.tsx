'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import Link from 'next/link'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FaRecordVinyl } from 'react-icons/fa6'

import loader from '@/assets/animations/loader.json'
import { AuthSocialButtons } from '@/components/ui/AuthSocialButtons'
import { Button } from '@/components/ui/button'
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
		defaultValues: { termsAccepted: false },
	})

	const onSubmit: SubmitHandler<TSignupSchema> = (data) => {
		signUp({
			email: data.email,
			password: data.password,
			confirmPassword: data.passwordConfirm,
			name: data.name,
			username: data.username,
		})
		setEmail(data.email)
	}

	return (
		<div className='relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-neutral-900 to-black max-[540px]:py-20'>
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/20 blur-3xl rounded-full max-[450px]:hidden'></div>
			<div className='absolute bottom-0 right-1/2 translate-x-1/2 w-[300px] h-[300px] bg-purple-500/10 blur-3xl rounded-full max-[450px]:hidden'></div>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4 }}
				className='w-full max-w-md bg-neutral-900/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-neutral-800'
			>
				<div className='flex flex-col items-center mb-6'>
					<div className='w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_var(--color-primary)]'>
						<FaRecordVinyl className='text-primary-foreground' />
					</div>
					<h1 className='text-white text-2xl font-bold mt-4'>
						Create your account
					</h1>
					<p className='text-gray-400 text-sm mt-1 text-center'>
						Join Loomio and start streaming today.
					</p>
				</div>

				<AuthSocialButtons />

				<div className='flex items-center gap-3 my-5'>
					<div className='h-[1px] bg-neutral-700 flex-1'></div>
					<p className='text-gray-400 text-xs uppercase'>or</p>
					<div className='h-[1px] bg-neutral-700 flex-1'></div>
				</div>

				<FormProvider {...methods}>
					<form
						onSubmit={methods.handleSubmit(onSubmit)}
						className='flex flex-col gap-5'
					>
						<SignUpFormFields />

						<Button
							disabled={isLoading}
							type='submit'
							className='
							bg-primary 
							hover:bg-primary/90 
							active:scale-[0.98]
							text-primary-foreground 
							font-semibold text-lg py-6 rounded-xl
							shadow-md hover:shadow-lg
							transition-all duration-200
							flex justify-center
						'
						>
							{isLoading ? (
								<Lottie animationData={loader} loop className='w-8 h-8' />
							) : (
								'Sign Up'
							)}
						</Button>

						<p className='text-gray-400 text-sm text-center mt-3'>
							Already have an account?{' '}
							<Link
								href={PAGES.LOGIN}
								className='text-primary hover:text-primary/80 font-medium'
							>
								Log in
							</Link>
						</p>
					</form>
				</FormProvider>
			</motion.div>

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
