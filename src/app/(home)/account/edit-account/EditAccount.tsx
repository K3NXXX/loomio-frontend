'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Lock, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { EmailVerificationForm } from '@/components/intro/auth/EmailVerificationForm'
import { useEditAccountFormErrors } from '@/hooks/account/useEditAccountFormErrors'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useUpdateAccount } from '@/hooks/user/useUpdateAccount'
import {
	editAccountSchema,
	type TEditAccountSchema,
} from '@/schemas/account/edit-account.schema'
import { authService } from '@/services/auth.service'
import { EditableField } from './EditableField'
import { EditablePasswordField } from './EditablePasswordField'
import { SetPasswordField } from './SetPasswordField'

function firstApiMessage(data: unknown): string | undefined {
	if (!data || typeof data !== 'object') return undefined
	const d = data as Record<string, unknown>
	const m = d.message
	if (typeof m === 'string') return m
	if (Array.isArray(m) && typeof m[0] === 'string') return m[0]
	return undefined
}

export default function EditAccount() {
	const t = useTranslations()
	const { userData } = useGetMe()
	const { updateAccount, isSuccess } = useUpdateAccount()

	const [emailVerifyOpen, setEmailVerifyOpen] = useState(false)
	const [pendingEmail, setPendingEmail] = useState('')
	const [emailVerifyExpiresAt, setEmailVerifyExpiresAt] = useState<Date>()
	const [emailFieldKey, setEmailFieldKey] = useState(0)

	const canChangeEmail = Boolean((userData as { canChangeEmail?: boolean })?.canChangeEmail)
	const canChangePassword = Boolean(
		(userData as { canChangePassword?: boolean })?.canChangePassword,
	)

	const isGoogleOnly =
		userData?.authProviders?.includes('google') && !userData?.hasPassword

	const { mutate: requestEmailChangeMut } = useMutation({
		mutationKey: ['requestEmailChange'],
		mutationFn: (nextEmail: string) => authService.requestEmailChange(nextEmail),
		onSuccess: (res, nextEmail) => {
			toast.success(t('accountPage.editAccount.emailVerifySent'))
			setPendingEmail(nextEmail.trim())
			setEmailVerifyExpiresAt(
				res.expiresAt ? new Date(res.expiresAt as unknown as string | number | Date) : undefined,
			)
			setEmailVerifyOpen(true)
		},
		onError: (err: unknown, nextEmail: string) => {
			const ax = err as { response?: { status?: number; data?: unknown } }
			const d = ax.response?.data
			if (ax.response?.status === 409 && d && typeof d === 'object' && 'expiresAt' in d) {
				const exp = (d as { expiresAt?: string }).expiresAt
				if (exp && nextEmail) {
					setPendingEmail(nextEmail.trim())
					setEmailVerifyExpiresAt(new Date(exp))
					setEmailVerifyOpen(true)
					return
				}
			}
			toast.error(firstApiMessage(d) ?? t('errors.auth.invalidVerificationCode'))
		},
	})

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<TEditAccountSchema>({
		resolver: zodResolver(editAccountSchema(!!userData?.hasPassword)),
		reValidateMode: 'onChange',
	})

	useEditAccountFormErrors(errors)

	const onSubmit = (data: TEditAccountSchema) => {
		const isPasswordUpdate =
			Boolean(data.newPassword) ||
			Boolean(data.currentPassword) ||
			Boolean(data.confirmPassword)

		if (isPasswordUpdate) {
			return updateAccount({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				hasPassword: Boolean(userData?.hasPassword),
			})
		}

		const newEmail = data.email?.trim() ?? ''
		const currentEmail = userData?.email?.trim() ?? ''
		const emailChanged =
			canChangeEmail &&
			Boolean(newEmail) &&
			newEmail.toLowerCase() !== currentEmail.toLowerCase()

		if (emailChanged) {
			const profileOnly: { name?: string; username?: string } = {}
			if (data.name) profileOnly.name = data.name
			if (data.username) profileOnly.username = data.username
			if (Object.keys(profileOnly).length > 0) {
				updateAccount({
					...profileOnly,
					hasPassword: Boolean(userData?.hasPassword),
				})
			}
			requestEmailChangeMut(newEmail)
			return
		}

		const payload: { name?: string; username?: string } = {}
		if (data.name) payload.name = data.name
		if (data.username) payload.username = data.username

		if (Object.keys(payload).length === 0) return

		updateAccount({ ...payload, hasPassword: Boolean(userData?.hasPassword) })
	}

	return (
		<div className='py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className='max-w-6xl mx-auto'
			>
				<h1 className='text-xl min-[400px]:text-2xl min-[600px]:text-3xl font-bold tracking-tight text-center text-foreground'>
					{t('accountPage.editAccount.title')}
				</h1>
				<p className='text-sm min-[400px]:text-base text-muted-foreground mt-1 text-center pb-5'>
					{t('accountPage.editAccount.subtitle')}
				</p>

				<form onSubmit={handleSubmit(onSubmit)}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4 }}
						className='relative rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-10'
					>
						<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

						<div className='p-6'>
							<div className='flex items-center gap-2 mb-6'>
								<User className='size-5 text-primary' />
								<h2 className='text-lg font-semibold text-foreground'>
									{t('accountPage.editAccount.profileSectionTitle')}
								</h2>
							</div>

							<div className='divide-y divide-border'>
								<div className='py-4'>
									<EditableField
										label={t('accountPage.editAccount.fields.username')}
										value={userData?.username}
										field='username'
										register={register}
										setValue={setValue}
										isSuccess={isSuccess}
										showAtPrefix
									/>
								</div>

								<div className='py-4'>
									{canChangeEmail && (
										<EditableField
											key={emailFieldKey}
											label={t('accountPage.editAccount.fields.email')}
											value={userData?.email}
											field='email'
											register={register}
											setValue={setValue}
											isSuccess={isSuccess}
										/>
									)}
								</div>
							</div>
						</div>
					</motion.div>

					{isGoogleOnly ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: 0.1 }}
							className='relative rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden'
						>
							<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

							<div className='p-6'>
								<div className='flex items-center gap-2 mb-6'>
									<Lock className='size-5 text-primary' />
									<h2 className='text-lg font-semibold text-foreground'>
										{t('accountPage.editAccount.securitySectionTitle')}
									</h2>
								</div>

								<div className='divide-y divide-border'>
									<div className='py-4'>
										<SetPasswordField
											register={register}
											isSubmitting={isSubmitting}
										/>
									</div>
								</div>
							</div>
						</motion.div>
					) : canChangePassword ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: 0.1 }}
							className='relative rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden'
						>
							<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

							<div className='p-6'>
								<div className='flex items-center gap-2 mb-6'>
									<Lock className='size-5 text-primary' />
									<h2 className='text-lg font-semibold text-foreground'>
										{t('accountPage.editAccount.securitySectionTitle')}
									</h2>
								</div>

								<div className='divide-y divide-border'>
									<div className='py-4'>
										<EditablePasswordField
											register={register}
											isSubmitting={isSubmitting}
										/>
									</div>
								</div>
							</div>
						</motion.div>
					) : null}
				</form>

				<EmailVerificationForm
					flow='email-change'
					open={emailVerifyOpen}
					onOpenChange={setEmailVerifyOpen}
					expiresAt={emailVerifyExpiresAt}
					setExpiresAt={(d) => setEmailVerifyExpiresAt(d)}
					email={pendingEmail}
					onVerified={() => setEmailFieldKey((k) => k + 1)}
				/>
			</motion.div>
		</div>
	)
}
