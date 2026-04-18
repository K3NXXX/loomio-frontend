import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'
import type { TUploadVideoSchema } from '@/schemas/videos/upload-video.schema'
import type { UseFormRegister } from 'react-hook-form'

interface UploadVideoStepFirstProps {
	register: UseFormRegister<TUploadVideoSchema>
	fileName: string
}

export function UploadVideoStepFirst({
	register,
	fileName,
}: UploadVideoStepFirstProps) {
	const t = useTranslations()

	return (
		<div className='flex flex-col gap-6 h-[476px]'>
			<div className='space-y-6'>
				<div className='space-y-2'>
					<label
						htmlFor='title'
						className='block text-sm font-medium text-gray-300 mb-2'
					>
						{t('uploadVideoModal.stepFirst.titleLabel')}
					</label>
					<Input
						id='title'
						type='text'
						defaultValue={fileName}
						placeholder={t('uploadVideoModal.stepFirst.titlePlaceholder')}
						{...register('title')}
						className='h-14 text-base bg-neutral-800/80 border border-neutral-700 rounded-xl 
						text-white placeholder-gray-500 px-4 
						focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary 
						transition-colors'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='description'
						className='block text-sm font-medium text-gray-300 mb-2'
					>
						{t('uploadVideoModal.stepFirst.descriptionLabel')}
					</label>
					<Textarea
						id='description'
						rows={6}
						placeholder={t(
							'uploadVideoModal.stepFirst.descriptionPlaceholder',
						)}
						{...register('description')}
						className='h-[140px] overflow-y-auto text-base bg-neutral-800/80 border border-neutral-700 
						rounded-xl text-white placeholder-gray-500 px-4 py-3 
						focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary 
						resize-none transition-colors'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='tags'
						className='block text-sm font-medium text-gray-300 mb-2'
					>
						{t('uploadVideoModal.stepFirst.tagsLabel')}
					</label>
					<Input
						id='tags'
						type='text'
						placeholder={t('uploadVideoModal.stepFirst.tagsPlaceholder')}
						{...register('tags')}
						className='h-14 text-base bg-neutral-800/80 border border-neutral-700 rounded-xl 
						text-white placeholder-gray-500 px-4 
						focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary 
						transition-colors'
					/>
					<p className='text-xs text-gray-500'>
						{t('uploadVideoModal.stepFirst.tagsFormatPrefix')}{' '}
						<span className='text-primary'>
							{t('uploadVideoModal.stepFirst.tagsFormatExample')}
						</span>
					</p>
				</div>
			</div>
		</div>
	)
}
