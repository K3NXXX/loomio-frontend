'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
	register: any
	isSubmitting: boolean
}

export function EditablePasswordField({ register, isSubmitting }: Props) {
	const [isEditing, setIsEditing] = useState(false)

	return (
		<div className='flex items-end justify-between gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3 transition-colors'>
			<div className='flex flex-col gap-1 w-full max-w-xl'>
				<span className='text-sm text-white/50'>Password</span>

				{!isEditing ? (
					<span className='text-white text-base h-11 flex items-center'>
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
							placeholder='Current password'
							{...register('currentPassword')}
							className='h-11 text-base bg-white/10 border-white/20 focus:border-primary'
						/>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
							<Input
								type='password'
								placeholder='New password'
								{...register('newPassword')}
								className='h-11 text-base bg-white/10 border-white/20 focus:border-primary'
							/>

							<Input
								type='password'
								placeholder='Confirm password'
								{...register('confirmPassword')}
								className='h-11 text-base bg-white/10 border-white/20 focus:border-primary'
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
						className='rounded-full px-4 border-white/10 bg-white/5 hover:bg-white/10'
						onClick={() => setIsEditing(true)}
					>
						Edit
					</Button>
				) : (
					<>
						<Button
							type='button'
							variant='outline'
							className='rounded-full px-4 border-white/10 bg-white/5 hover:bg-white/10'
							onClick={() => setIsEditing(false)}
						>
							Cancel
						</Button>

						<Button
							type='submit'
							className='rounded-full px-4 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'
							disabled={isSubmitting}
						>
							Save
						</Button>
					</>
				)}
			</div>
		</div>
	)
}
