'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Lock, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEditAccountFormErrors } from '@/hooks/account/useEditAccountFormErrors'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useUpdateAccount } from '@/hooks/user/useUpdateAccount'
import {
	editAccountSchema,
	type TEditAccountSchema,
} from '@/schemas/account/edit-account.schema'
import { EditableField } from './EditableField'
import { EditablePasswordField } from './EditablePasswordField'
import { SetPasswordField } from './SetPasswordField'

export default function EditAccount() {
	const t = useTranslations()
	const { userData } = useGetMe()
	const { updateAccount, isSuccess } = useUpdateAccount()

	const canChangeEmail = Boolean((userData as any)?.canChangeEmail)
	const canChangePassword = Boolean((userData as any)?.canChangePassword)

	const isGoogleOnly =
		userData?.authProviders?.includes('google') && !userData?.hasPassword

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
			data.newPassword || data.currentPassword || data.confirmPassword

		if (isPasswordUpdate) {
			return updateAccount({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				hasPassword: Boolean(userData?.hasPassword),
			})
		}

		const payload: any = {}

		if (data.name) payload.name = data.name
		if (data.email) payload.email = data.email
		if (data.username) payload.username = data.username

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
			</motion.div>
		</div>
	)
}
