'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { TEditVideoSchema } from '@/schemas/videos/edit-video.schema'
import type { IVideo } from '@/types/video.types'
import { useTranslations } from 'next-intl'
import type { UseFormRegister } from 'react-hook-form'

interface IEditVideoStepFirstProps {
	register: UseFormRegister<TEditVideoSchema>
	fileName: string
	video: IVideo
}

export function EditVideoStepFirst({
	register,
	video,
}: IEditVideoStepFirstProps) {
	const t = useTranslations('uploadVideoModal.stepFirst')

	return (
		<div className='flex flex-col gap-6 h-[476px]'>
			<div className='space-y-6'>
				<div className='space-y-2'>
					<label
						htmlFor='title'
						className='block text-sm font-medium text-muted-foreground mb-2'
					>
						{t('titleLabel')}
					</label>
					<Input
						id='title'
						type='text'
						defaultValue={video.title}
						placeholder={t('titlePlaceholder')}
						{...register('title')}
						className='h-14 text-base bg-background border border-border rounded-xl 
						text-foreground placeholder:text-muted-foreground px-4 
						focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary 
						transition-colors'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='description'
						className='block text-sm font-medium text-muted-foreground mb-2'
					>
						{t('descriptionLabel')}
					</label>
					<Textarea
						id='description'
						rows={6}
						defaultValue={video.description ? video.description : ''}
						placeholder={t('descriptionPlaceholder')}
						{...register('description')}
						className='h-[140px] overflow-y-auto text-base bg-background border border-border 
						rounded-xl text-foreground placeholder:text-muted-foreground px-4 py-3 
						focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary 
						resize-none transition-colors'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='tags'
						className='block text-sm font-medium text-muted-foreground mb-2'
					>
						{t('tagsLabel')}
					</label>
					<Input
						id='tags'
						type='text'
						placeholder={t('tagsPlaceholder')}
						defaultValue={video.tags ? video.tags : ''}
						{...register('tags')}
						className='h-14 text-base bg-background border border-border rounded-xl 
						text-foreground placeholder:text-muted-foreground px-4 
						focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary 
						transition-colors'
					/>
					<p className='text-xs text-muted-foreground'>
						{t('tagsFormatPrefix')}{' '}
						<span className='text-primary'>{t('tagsFormatExample')}</span>
					</p>
				</div>
			</div>
		</div>
	)
}
