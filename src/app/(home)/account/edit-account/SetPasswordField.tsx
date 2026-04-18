'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'

interface Props {
	register: any
	isSubmitting: boolean
}

export function SetPasswordField({ register, isSubmitting }: Props) {
	const t = useTranslations()
	const [isEditing, setIsEditing] = useState(false)

	return (
		<div className='flex flex-col min-[500px]:flex-row min-[500px]:items-end justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-3 min-[400px]:px-4 py-3 transition-colors'>
			<div className='flex flex-col gap-1 w-full max-w-xl'>
				<span className='text-xs min-[400px]:text-sm text-white/50'>
					{t('accountPage.editAccount.setPassword.label')}
				</span>

				{!isEditing ? (
					<span className='text-white text-sm min-[400px]:text-base h-9 min-[400px]:h-11 flex items-center'>
						{t('accountPage.editAccount.setPassword.emptyValue')}
					</span>
				) : (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className='flex flex-col gap-3 mt-2'
					>
						<div className='grid grid-cols-1 gap-3'>
							<Input
								type='password'
								placeholder={t(
									'accountPage.editAccount.setPassword.newPasswordPlaceholder',
								)}
								{...register('newPassword')}
								className='h-9 min-[400px]:h-11 text-sm min-[400px]:text-base bg-white/10 border-white/20 focus:border-primary'
							/>

							<Input
								type='password'
								placeholder={t(
									'accountPage.editAccount.setPassword.confirmPasswordPlaceholder',
								)}
								{...register('confirmPassword')}
								className='h-9 min-[400px]:h-11 text-sm min-[400px]:text-base bg-white/10 border-white/20 focus:border-primary'
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
						className='rounded-full px-3 min-[400px]:px-4 h-8 min-[400px]:h-10 text-xs min-[400px]:text-sm border-white/10 bg-white/5 hover:bg-white/10'
						onClick={() => setIsEditing(true)}
					>
						{t('accountPage.editAccount.setPassword.editButton')}
					</Button>
				) : (
					<>
						<Button
							type='button'
							variant='outline'
							className='rounded-full px-3 min-[400px]:px-4 h-8 min-[400px]:h-10 text-xs min-[400px]:text-sm border-white/10 bg-white/5 hover:bg-white/10'
							onClick={() => setIsEditing(false)}
						>
							{t('accountPage.editAccount.setPassword.cancelButton')}
						</Button>

						<Button
							type='submit'
							className='rounded-full px-3 min-[400px]:px-4 h-8 min-[400px]:h-10 text-xs min-[400px]:text-sm bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'
							disabled={isSubmitting}
						>
							{t('accountPage.editAccount.setPassword.saveButton')}
						</Button>
					</>
				)}
			</div>
		</div>
	)
}
