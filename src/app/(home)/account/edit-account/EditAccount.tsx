'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Lock, User } from 'lucide-react'
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
	const { userData } = useGetMe()
	const { updateAccount, isSuccess } = useUpdateAccount()

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
			})
		}

		const payload: any = {}

		if (data.name) payload.name = data.name
		if (data.email) payload.email = data.email
		if (data.username) payload.username = data.username

		updateAccount(payload)
	}

	return (
		<div className='py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className='max-w-6xl mx-auto'
			>
				<h1 className='text-3xl font-bold tracking-tight text-center'>
					Edit Account
				</h1>
				<p className='text-muted-foreground mt-1 text-center pb-5'>
					Update your profile information below
				</p>

				<form onSubmit={handleSubmit(onSubmit)}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4 }}
						className='relative rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-10'
					>
						<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

						<div className='p-6'>
							<div className='flex items-center gap-2 mb-6'>
								<User className='size-5 text-primary' />
								<h2 className='text-lg font-semibold'>Your profile data</h2>
							</div>

							<div className='divide-y divide-white/10'>
								<div className='py-4'>
									<EditableField
										label='Name'
										value={userData?.name}
										field='name'
										register={register}
										setValue={setValue}
										isSuccess={isSuccess}
									/>
								</div>

								<div className='py-4'>
									<EditableField
										label='Username'
										value={userData?.username}
										field='username'
										register={register}
										setValue={setValue}
										isSuccess={isSuccess}
									/>
								</div>

								<div className='py-4'>
									{userData?.canChangeEmail && (
										<EditableField
											label='Email'
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
							className='relative rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden'
						>
							<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

							<div className='p-6'>
								<div className='flex items-center gap-2 mb-6'>
									<Lock className='size-5 text-primary' />
									<h2 className='text-lg font-semibold'>Security</h2>
								</div>

								<div className='divide-y divide-white/10'>
									<div className='py-4'>
										<SetPasswordField
											register={register}
											isSubmitting={isSubmitting}
										/>
									</div>
								</div>
							</div>
						</motion.div>
					) : userData?.canChangePassword ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: 0.1 }}
							className='relative rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden'
						>
							<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

							<div className='p-6'>
								<div className='flex items-center gap-2 mb-6'>
									<Lock className='size-5 text-primary' />
									<h2 className='text-lg font-semibold'>Security</h2>
								</div>

								<div className='divide-y divide-white/10'>
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
