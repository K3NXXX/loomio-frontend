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
import { AvatarUploader } from './AvatarUploader'

export default function EditAccount() {
	const { userData } = useGetMe()
	const { updateAccount } = useUpdateAccount()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<TEditAccountSchema>({
		resolver: zodResolver(editAccountSchema),
		reValidateMode: 'onChange',
	})

	useEditAccountFormErrors(errors)

	const onSubmit = (data: TEditAccountSchema) => {
		const cleaned: Record<string, unknown> = {}

		for (const key in data) {
			const value = data[key as keyof TEditAccountSchema]
			if (value !== '' && value !== null && value !== undefined) {
				cleaned[key] = value
			}
		}

		updateAccount(cleaned)
	}

	return (
		<div className='min-h-screen px-4 py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className='max-w-4xl mx-auto'
			>
				<AvatarUploader userData={userData} />
				<h1 className='text-3xl font-bold tracking-tight text-center'>
					Edit Account
				</h1>
				<p className='text-muted-foreground mt-1 text-center pb-5'>
					Update your profile information below
				</p>
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
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
								<h2 className='text-lg font-semibold'>Profile</h2>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div className='space-y-2'>
									<Label htmlFor='name'>Name</Label>
									<Input
										id='name'
										defaultValue={userData?.name}
										placeholder='Your full name'
										{...register('name')}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										type='email'
										defaultValue={userData?.email}
										placeholder='you@example.com'
										{...register('email')}
									/>
								</div>
							</div>

							<div className='space-y-2 mt-6'>
								<Label htmlFor='bio'>Bio</Label>
								<textarea
									id='bio'
									defaultValue={userData?.bio}
									placeholder='Tell something about yourself...'
									className='w-full rounded-md border p-3 min-h-[100px] text-sm 
									focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all'
									{...register('bio')}
								/>
							</div>
						</div>
					</motion.div>

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
								<h2 className='text-lg font-semibold'>Password</h2>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div className='space-y-2'>
									<Label htmlFor='newPassword'>New Password (optional)</Label>
									<Input
										id='newPassword'
										type='password'
										placeholder='Enter new password'
										{...register('newPassword')}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='currentPassword'>
										Current Password (required)
									</Label>
									<Input
										id='currentPassword'
										type='password'
										placeholder='Enter current password'
										{...register('currentPassword')}
									/>
								</div>
							</div>
						</div>
					</motion.div>

					<div className='flex justify-end gap-3 mt-8'>
						<Button
							type='button'
							variant='outline'
							className='rounded-full px-6'
							onClick={() => reset()}
						>
							Cancel
						</Button>
						<Button
							type='submit'
							className='rounded-full px-6'
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Saving...' : 'Save changes'}
						</Button>
					</div>
				</form>
			</motion.div>
		</div>
	)
}
