'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'

interface Props {
	register: any
	isSubmitting: boolean
}

export function EditablePasswordField({ register, isSubmitting }: Props) {
	const [isEditing, setIsEditing] = useState(false)
	const t = useTranslations()

	return (
		<div className='flex items-end justify-between gap-4 rounded-xl bg-muted/40 border border-border px-4 py-3 transition-colors dark:bg-white/5 dark:border-white/10'>
			<div className='flex flex-col gap-1 w-full max-w-xl'>
				<span className='text-sm text-muted-foreground'>
					{t('accountPage.editAccount.setPassword.label')}
				</span>

				{!isEditing ? (
					<span className='text-foreground text-base h-11 flex items-center'>
						••••••••
					</span>
				) : (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className='flex flex-col gap-3 mt-2'
					>
						<Input
							type='password'
							placeholder={t('validation.account.currentPasswordRequired')}
							{...register('currentPassword')}
							className='h-11 text-base bg-background border-border dark:bg-white/10 dark:border-white/20 focus:border-primary'
						/>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
							<Input
								type='password'
								placeholder={t(
									'accountPage.editAccount.setPassword.newPasswordPlaceholder',
								)}
								{...register('newPassword')}
								className='h-11 text-base bg-background border-border dark:bg-white/10 dark:border-white/20 focus:border-primary'
							/>

							<Input
								type='password'
								placeholder={t(
									'accountPage.editAccount.setPassword.confirmPasswordPlaceholder',
								)}
								{...register('confirmPassword')}
								className='h-11 text-base bg-background border-border dark:bg-white/10 dark:border-white/20 focus:border-primary'
							/>
						</div>
					</motion.div>
				)}
			</div>

			<div className='shrink-0 flex items-center gap-2'>
				{!isEditing ? (
					<Button
						type='button'
						variant='outline'
						className='rounded-full px-4 border-border bg-background hover:bg-muted dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
						onClick={() => setIsEditing(true)}
					>
						{t('common.edit')}
					</Button>
				) : (
					<>
						<Button
							type='button'
							variant='outline'
							className='rounded-full px-4 border-border bg-background hover:bg-muted dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
							onClick={() => setIsEditing(false)}
						>
							{t('common.cancel')}
						</Button>

						<Button
							type='submit'
							className='rounded-full px-4 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'
							disabled={isSubmitting}
						>
							{t('common.save')}
						</Button>
					</>
				)}
			</div>
		</div>
	)
}
