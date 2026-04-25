'use client'

import type { TUploadVideoSchema } from '@/schemas/videos/upload-video.schema'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { enUS, uk as ukDateFns } from 'date-fns/locale'
import { Calendar, Clock } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface UploadVideoStepThirdProps {
	setValue: UseFormSetValue<TUploadVideoSchema>
	watch: UseFormWatch<TUploadVideoSchema>
}

export function UploadVideoStepThird({
	setValue,
	watch,
}: UploadVideoStepThirdProps) {
	const t = useTranslations('uploadVideoModal.stepThird')
	const locale = useLocale()
	const dateFnsLocale = locale === 'uk' ? ukDateFns : enUS

	const publishType = watch('publishType')
	const publishDate = watch('publishDate')

	const selectedDate = publishDate ? new Date(publishDate) : undefined

	return (
		<div className='flex flex-col gap-6 h-[476px]'>
			<div className='flex flex-col'>
				<h3 className='text-lg font-semibold mb-3 text-white'>{t('title')}</h3>
				<p className='text-sm text-gray-400 mb-3'>{t('description')}</p>

				<div className='flex gap-4'>
					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full
							${publishType === 'now' ? 'border-primary bg-primary/10' : 'border-neutral-700 hover:border-primary/50'}
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
						<Clock className='w-5 h-5 text-primary shrink-0' />
						<div className='flex flex-col'>
							<span className='text-white font-medium'>{t('publishNow')}</span>
							<span className='text-xs text-gray-400'>
								{t('publishNowHint')}
							</span>
						</div>
					</label>

					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[220px]
							${publishType === 'scheduled' ? 'border-primary bg-primary/10' : 'border-neutral-700 hover:border-primary/50'}
						`}
					>
						<input
							type='radio'
							name='publishType'
							value='scheduled'
							checked={publishType === 'scheduled'}
							onChange={() =>
								setValue('publishType', 'scheduled', {
									shouldValidate: true,
								})
							}
							className='hidden'
						/>
						<Calendar className='w-5 h-5 text-primary shrink-0' />
						<div className='flex flex-col'>
							<span className='text-white font-medium'>
								{t('scheduleOption')}
							</span>
							<span className='text-xs text-gray-400'>{t('scheduleHint')}</span>
						</div>
					</label>
				</div>

				{publishType === 'scheduled' && (
					<div className='mt-4 max-w-[300px] flex flex-col gap-2'>
						<label className='text-sm text-gray-300'>
							{t('publishDateTimeLabel')}
						</label>

						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant='outline'
									className='justify-start text-left font-normal bg-neutral-800 border-neutral-700 hover:bg-neutral-700'
								>
									<Calendar className='mr-2 h-4 w-4 text-white/50' />
									{selectedDate
										? format(selectedDate, 'PPP HH:mm', {
												locale: dateFnsLocale,
											})
										: t('pickDate')}
								</Button>
							</PopoverTrigger>

							<PopoverContent className='w-auto p-0 bg-neutral-900 border-neutral-700'>
								<div className='p-3'>
									<CalendarPicker
										mode='single'
										selected={selectedDate}
										onSelect={(date) => {
											if (!date) return
											const current = selectedDate ?? new Date()
											date.setHours(current.getHours())
											date.setMinutes(current.getMinutes())

											setValue('publishDate', date.toISOString(), {
												shouldValidate: true,
											})
										}}
										disabled={(date) => {
											const today = new Date()
											today.setHours(0, 0, 0, 0)

											return date < today
										}}
										initialFocus
										locale={dateFnsLocale}
									/>

									<div className='mt-3'>
										<input
											type='time'
											className='w-full bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 text-sm text-white'
											value={
												selectedDate
													? `${String(selectedDate.getHours()).padStart(2, '0')}:${String(selectedDate.getMinutes()).padStart(2, '0')}`
													: ''
											}
											onChange={(e) => {
												const [h, m] = e.target.value.split(':').map(Number)
												const date = selectedDate ?? new Date()
												date.setHours(h)
												date.setMinutes(m)

												setValue('publishDate', date.toISOString(), {
													shouldValidate: true,
												})
											}}
										/>
									</div>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				)}
			</div>
		</div>
	)
}
