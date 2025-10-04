'use client'

import { Calendar, Clock } from 'lucide-react'
import { useState } from 'react'

interface UploadVideoStepThirdProps {}

export function UploadVideoStepThird({}: UploadVideoStepThirdProps) {
	// 📅 Стан: публікувати зараз чи запланувати
	const [publishType, setPublishType] = useState<'now' | 'scheduled'>('now')
	const [publishDate, setPublishDate] = useState<string>('')

	return (
		<div className='flex flex-col gap-6 h-[476px]'>
			{/* 🕓 Schedule */}
			<div className='flex flex-col'>
				<h3 className='text-lg font-semibold mb-3 text-white'>Schedule</h3>
				<p className='text-sm text-gray-400 mb-3'>
					Choose when you want your video to go live.
				</p>

				<div className='flex gap-4'>
					{/* Publish Now */}
					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[220px]
							${publishType === 'now' ? 'border-primary bg-primary/10' : 'border-neutral-700 hover:border-primary/50'}
						`}
					>
						<input
							type='radio'
							name='publishType'
							value='now'
							checked={publishType === 'now'}
							onChange={() => setPublishType('now')}
							className='hidden'
						/>
						<Clock className='w-5 h-5 text-primary' />
						<div className='flex flex-col'>
							<span className='text-white font-medium'>Publish now</span>
							<span className='text-xs text-gray-400'>
								Video will be visible right away
							</span>
						</div>
					</label>

					{/* Schedule for later */}
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
							onChange={() => setPublishType('scheduled')}
							className='hidden'
						/>
						<Calendar className='w-5 h-5 text-primary' />
						<div className='flex flex-col'>
							<span className='text-white font-medium'>Schedule</span>
							<span className='text-xs text-gray-400'>
								Choose a specific date & time
							</span>
						</div>
					</label>
				</div>

				{/* Date & Time Picker */}
				{publishType === 'scheduled' && (
					<div className='mt-4 max-w-[300px]'>
						<label
							htmlFor='publish-date'
							className='block text-sm text-gray-300 mb-1'
						>
							Publish Date & Time
						</label>
						<input
							type='datetime-local'
							id='publish-date'
							value={publishDate}
							onChange={(e) => setPublishDate(e.target.value)}
							className='w-full rounded-md border border-neutral-700 bg-neutral-800 text-white px-3 py-2 text-sm outline-none focus:border-primary transition'
						/>
					</div>
				)}
			</div>
		</div>
	)
}
