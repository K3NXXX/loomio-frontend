import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { TUploadVideoSchema } from '@/schemas/videos/upload-video.schema'
import type { UseFormRegister } from 'react-hook-form'
import { FaCloudUploadAlt } from 'react-icons/fa'

interface UploadVideoFileProps {
	register: UseFormRegister<TUploadVideoSchema>
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	errorMessage?: string
}

export function UploadVideoFile({
	register,
	handleFileChange,
	errorMessage,
}: UploadVideoFileProps) {
	const t = useTranslations()
	const [isDragging, setIsDragging] = useState(false)

	const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = () => {
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault()
		setIsDragging(false)

		const file = e.dataTransfer.files?.[0]
		if (!file) return

		const fakeEvent = {
			target: { files: [file] },
		} as unknown as React.ChangeEvent<HTMLInputElement>

		handleFileChange(fakeEvent)
	}

	return (
		<div className='flex flex-col items-center justify-center py-10 min-[500px]:py-16 min-[700px]:py-20 text-center w-full px-3 min-[500px]:px-0'>
			<label
				htmlFor='file'
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`
					flex flex-col items-center justify-center w-full
					max-w-lg border-2 border-dashed rounded-2xl
					p-5 min-[400px]:p-7 min-[700px]:p-10
					cursor-pointer transition-all duration-300 ease-in-out
					${
						isDragging
							? 'border-primary bg-neutral-800/60 scale-[1.02]'
							: 'border-neutral-700 hover:border-primary hover:bg-neutral-800/50'
					}
				`}
			>
				<div className='mb-3 min-[500px]:mb-5 bg-neutral-800 p-4 min-[500px]:p-5 min-[700px]:p-6 rounded-full'>
					<FaCloudUploadAlt className='text-primary text-4xl min-[400px]:text-5xl min-[700px]:text-7xl' />
				</div>

				<p className='text-gray-300 text-sm min-[400px]:text-base min-[700px]:text-lg font-medium'>
					{t('uploadVideoModal.file.dragDrop')}
				</p>
				<p className='text-gray-500 text-xs min-[400px]:text-sm mt-1'>
					{t('uploadVideoModal.file.orClick')}
				</p>

				<input
					type='file'
					id='file'
					accept='video/*'
					{...register('file')}
					className='hidden'
					onChange={handleFileChange}
				/>
			</label>

			<p className='text-gray-400 text-xs min-[400px]:text-sm mt-3 min-[500px]:mt-4'>
				{t('uploadVideoModal.file.supportedPrefix')}{' '}
				<span className='text-white'>
					{t('uploadVideoModal.file.formatsList')}
				</span>{' '}
				• {t('uploadVideoModal.file.maxSize')}
			</p>

			{errorMessage && (
				<p className='text-red-400 text-xs min-[400px]:text-sm mt-1'>
					{errorMessage}
				</p>
			)}
		</div>
	)
}
