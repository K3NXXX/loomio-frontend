'use client'

import type { TEditVideoSchema } from '@/schemas/videos/edit-video.schema'
import type { IVideo } from '@/types/video.types'
import { formatDateTimeLocal } from '@/utils/formatDateTimeLocal'

import { Calendar, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface EditVideoStepThirdProps {
	setValue: UseFormSetValue<TEditVideoSchema>
	watch: UseFormWatch<TEditVideoSchema>
	video: IVideo
}

export function EditVideoStepThird({
	setValue,
	watch,
	video,
}: EditVideoStepThirdProps) {
	const t = useTranslations('uploadVideoModal.stepThird')
	const publishType = watch('publishType') || video.publishType
	const publishDate = watch('publishDate') || video.publishDate

	return (
		<div className='flex flex-col gap-6 h-[476px]'>
			<div className='flex flex-col'>
				<h3 className='text-lg font-semibold mb-3 text-white'>{t('title')}</h3>
				<p className='text-sm text-gray-400 mb-3'>{t('description')}</p>

				<div className='flex gap-4'>
					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[220px]
							${
								publishType === 'now'
									? 'border-primary bg-primary/10'
									: 'border-neutral-700 hover:border-primary/50'
							}
						`}
					>
						<input
							type='radio'
							name='publishType'
							value='now'
							checked={publishType === 'now'}
							onChange={() =>
								setValue('publishType', 'now', { shouldValidate: true })
							}
							className='hidden'
						/>
						<Clock className='w-5 h-5 text-primary' />
						<div className='flex flex-col'>
							<span className='text-white font-medium'>{t('publishNow')}</span>
							<span className='text-xs text-gray-400'>
								{t('publishNowHint')}
							</span>
						</div>
					</label>

					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[220px]
							${
								publishType === 'scheduled'
									? 'border-primary bg-primary/10'
									: 'border-neutral-700 hover:border-primary/50'
							}
						`}
					>
						<input
							type='radio'
							name='publishType'
							value='scheduled'
							checked={publishType === 'scheduled'}
							onChange={() =>
								setValue('publishType', 'scheduled', { shouldValidate: true })
							}
							className='hidden'
						/>
						<Calendar className='w-5 h-5 text-primary' />
						<div className='flex flex-col'>
							<span className='text-white font-medium'>
								{t('scheduleOption')}
							</span>
							<span className='text-xs text-gray-400'>{t('scheduleHint')}</span>
						</div>
					</label>
				</div>

				{publishType === 'scheduled' && (
					<div className='mt-4 max-w-[300px]'>
						<label
							htmlFor='publish-date'
							className='block text-sm text-gray-300 mb-1'
						>
							{t('publishDateTimeLabel')}
						</label>
						<input
							type='datetime-local'
							id='publish-date'
							value={formatDateTimeLocal(publishDate)}
							min={formatDateTimeLocal(new Date())}
							onChange={(e) =>
								setValue('publishDate', e.target.value, {
									shouldValidate: true,
								})
							}
							className='w-full rounded-md border border-neutral-700 bg-neutral-800 text-white px-3 py-2 text-sm outline-none focus:border-primary transition'
						/>
					</div>
				)}
			</div>
		</div>
	)
}
