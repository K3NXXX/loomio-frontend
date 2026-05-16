'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FaRecordVinyl } from 'react-icons/fa6'

import loader from '@/assets/animations/loader.json'
import { Button } from '@/components/ui/button'
import { AuthSocialButtons } from '@/components/ui/custom/AuthSocialButtons'
import { PAGES } from '@/constants/pages.constants'
import { useSignUp } from '@/hooks/auth/useSignUp'
import { signupSchema } from '@/schemas/auth/signup-schema'
import { EmailVerificationForm } from '../EmailVerificationForm'
import { SignUpFormFields } from './SignUpFormFields'

import type { TSignupSchema } from '@/schemas/auth/signup-schema'
import type { SubmitHandler } from 'react-hook-form'

export function SignUpForm() {
	const t = useTranslations()
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
			username: data.username,
		})
		setEmail(data.email)
	}

	return (
		<div className='relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-muted/35 to-background text-foreground dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 max-[540px]:py-20'>
			<div className='pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/15 dark:bg-primary/20 blur-3xl rounded-full max-[450px]:hidden' />
			<div className='pointer-events-none absolute bottom-0 right-1/2 translate-x-1/2 w-[300px] h-[300px] bg-purple-500/10 blur-3xl rounded-full max-[450px]:hidden' />

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4 }}
				className='w-full max-w-md rounded-2xl border border-border bg-card/95 backdrop-blur-md p-8 shadow-xl text-card-foreground'
			>
				<div className='flex flex-col items-center mb-6'>
					<div className='w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_var(--color-primary)]'>
						<FaRecordVinyl className='text-primary-foreground' />
					</div>
					<h1 className='text-foreground text-2xl font-bold mt-4'>
						{t('auth.signup.title')}
					</h1>
					<p className='text-muted-foreground text-sm mt-1 text-center'>
						{t('auth.signup.subtitle')}
					</p>
				</div>

				<AuthSocialButtons />

				<div className='flex items-center gap-3 my-5'>
					<div className='h-px bg-border flex-1' />
					<p className='text-muted-foreground text-xs uppercase'>
						{t('auth.signup.orDivider')}
					</p>
					<div className='h-px bg-border flex-1' />
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
								<Lottie animationData={loader} loop className='w-10 h-10' />
							) : (
								t('auth.signup.submit')
							)}
						</Button>

						<p className='text-muted-foreground text-sm text-center mt-3'>
							{t('auth.signup.alreadyHaveAccount')}{' '}
							<Link
								href={PAGES.LOGIN}
								className='text-primary hover:text-primary/80 font-medium'
							>
								{t('auth.signup.logIn')}
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
