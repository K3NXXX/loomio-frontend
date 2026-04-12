'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

type Props = {
	label: string
	value?: string
	field: string
	register: any
	setValue: any
	isSuccess: boolean
}

export function EditableField({
	label,
	value,
	field,
	register,
	setValue,
	isSuccess,
}: Props) {
	const [isEditing, setIsEditing] = useState(false)

	const handleEdit = () => {
		setValue(field, value || '', { shouldDirty: true })
		setIsEditing(true)
	}

	const handleCancel = () => {
		setValue(field, value || '')
		setIsEditing(false)
	}

	useEffect(() => {
		if (isSuccess) {
			setIsEditing(false)
		}
	}, [isSuccess])

	return (
		<div className='flex items-end justify-between gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3 transition-colors'>
			<div className='flex flex-col gap-1 w-full max-w-xl'>
				<span className='text-sm text-white/50'>{label}</span>

				{!isEditing ? (
					<span className='text-white text-base h-11 flex items-center'>
						{value || '—'}
					</span>
				) : (
					<Input
						autoFocus
						{...register(field)}
						className='h-11 text-base bg-white/10 border-white/20 focus:border-primary'
					/>
				)}
			</div>

			<div className='shrink-0 flex items-center gap-2'>
				{!isEditing ? (
					<Button
						type='button'
						variant='outline'
						className='rounded-full px-4 border-white/10 bg-white/5 hover:bg-white/10'
						onClick={handleEdit}
					>
						Edit
					</Button>
				) : (
					<>
						<Button
							type='button'
							variant='outline'
							className='rounded-full px-4 border-white/10 bg-white/5 hover:bg-white/10'
							onClick={handleCancel}
						>
							Cancel
						</Button>

						<Button
							type='submit'
							className='rounded-full px-4 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'
						>
							Save
						</Button>
					</>
				)}
			</div>
		</div>
	)
}
