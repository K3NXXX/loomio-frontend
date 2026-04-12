import { useState } from 'react'
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
		<div className='flex flex-col items-center justify-center py-20 text-center w-full'>
			<label
				htmlFor='file'
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`
					flex flex-col items-center justify-center w-full
					max-w-lg border-2 border-dashed rounded-2xl p-10 cursor-pointer
					transition-all duration-300 ease-in-out
					${
						isDragging
							? 'border-primary bg-neutral-800/60 scale-[1.02]'
							: 'border-neutral-700 hover:border-primary hover:bg-neutral-800/50'
					}
				`}
			>
				<div className='mb-5 bg-neutral-800 p-6 rounded-full'>
					<FaCloudUploadAlt className='text-primary text-7xl' />
				</div>

				<p className='text-gray-300 text-lg font-medium'>
					Drag & drop your video here
				</p>
				<p className='text-gray-500 text-sm mt-1'>or click to select a file</p>

				<input
					type='file'
					id='file'
					accept='video/*'
					{...register('file')}
					className='hidden'
					onChange={handleFileChange}
				/>
			</label>

			<p className='text-gray-400 text-sm mt-4'>
				Supported formats: <span className='text-white'>MP4, MOV, AVI</span> •
				Max size 2 GB
			</p>

			{errorMessage && (
				<p className='text-red-400 text-sm mt-1'>{errorMessage}</p>
			)}
		</div>
	)
}
