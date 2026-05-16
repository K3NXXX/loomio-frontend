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
	showAtPrefix?: boolean
}

export function EditableField({
	label,
	value,
	field,
	register,
	setValue,
	isSuccess,
	showAtPrefix = false,
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
		<div className='flex flex-col min-[500px]:flex-row min-[500px]:items-end justify-between gap-3 rounded-xl bg-muted/40 border border-border px-3 min-[400px]:px-4 py-3 transition-colors dark:bg-white/5 dark:border-white/10'>
			<div className='flex flex-col gap-1 w-full max-w-xl'>
				<span className='text-xs min-[400px]:text-sm text-muted-foreground'>
					{label}
				</span>

			{!isEditing ? (
				<span className='text-foreground text-sm min-[400px]:text-base h-9 min-[400px]:h-11 flex items-center'>
					{value ? (
						showAtPrefix ? <><span className='text-primary'>@</span>{value}</> : value
					) : '—'}
				</span>
			) : (
				<div className='relative'>
					{showAtPrefix && (
						<span className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary text-sm min-[400px]:text-base'>
							@
						</span>
					)}
					<Input
						autoFocus
						{...register(field)}
						className={`h-9 min-[400px]:h-11 text-sm min-[400px]:text-base bg-background border-border dark:bg-white/10 dark:border-white/20 focus:border-primary ${showAtPrefix ? 'pl-7' : ''}`}
					/>
				</div>
			)}
			</div>

			<div className='shrink-0 flex items-center gap-2 min-[500px]:pb-0'>
				{!isEditing ? (
					<Button
						type='button'
						variant='outline'
						className='rounded-full px-3 min-[400px]:px-4 h-8 min-[400px]:h-10 text-xs min-[400px]:text-sm border-border bg-background hover:bg-muted dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
						onClick={handleEdit}
					>
						{t('playlists.edit')}
					</Button>
				) : (
					<>
						<Button
							type='button'
							variant='outline'
							className='rounded-full px-3 min-[400px]:px-4 h-8 min-[400px]:h-10 text-xs min-[400px]:text-sm border-border bg-background hover:bg-muted dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
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
