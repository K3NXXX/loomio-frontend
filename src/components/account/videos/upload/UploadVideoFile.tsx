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
	return (
		<div className='flex flex-col items-center justify-center py-20 text-center w-full'>
			<label
				htmlFor='file'
				className='
				flex flex-col items-center justify-center w-full
				max-w-lg border-2 border-dashed border-neutral-700
				rounded-2xl p-10 cursor-pointer
				transition-all duration-300 ease-in-out
				hover:border-primary hover:bg-neutral-800/50
			'
			>
				<div className='mb-5 bg-neutral-800 p-6 rounded-full group-hover:bg-neutral-700 transition-colors'>
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
