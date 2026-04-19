'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
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
	const t = useTranslations()

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
		<div className='flex flex-col min-[500px]:flex-row min-[500px]:items-end justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-3 min-[400px]:px-4 py-3 transition-colors'>
			<div className='flex flex-col gap-1 w-full max-w-xl'>
				<span className='text-xs min-[400px]:text-sm text-white/50'>
					{label}
				</span>

				{!isEditing ? (
					<span className='text-white text-sm min-[400px]:text-base h-9 min-[400px]:h-11 flex items-center'>
						{value || '—'}
					</span>
				) : (
					<Input
						autoFocus
						{...register(field)}
						className='h-9 min-[400px]:h-11 text-sm min-[400px]:text-base bg-white/10 border-white/20 focus:border-primary'
					/>
				)}
			</div>

			<div className='shrink-0 flex items-center gap-2 min-[500px]:pb-0'>
				{!isEditing ? (
					<Button
						type='button'
						variant='outline'
						className='rounded-full px-3 min-[400px]:px-4 h-8 min-[400px]:h-10 text-xs min-[400px]:text-sm border-white/10 bg-white/5 hover:bg-white/10'
						onClick={handleEdit}
					>
						{t('playlists.edit')}
					</Button>
				) : (
					<>
						<Button
							type='button'
							variant='outline'
							className='rounded-full px-3 min-[400px]:px-4 h-8 min-[400px]:h-10 text-xs min-[400px]:text-sm border-white/10 bg-white/5 hover:bg-white/10'
							onClick={handleCancel}
						>
							{t('common.cancel')}
						</Button>

						<Button
							type='submit'
							className='rounded-full px-3 min-[400px]:px-4 h-8 min-[400px]:h-10 text-xs min-[400px]:text-sm bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'
						>
							{t('common.save')}
						</Button>
					</>
				)}
			</div>
		</div>
	)
}
