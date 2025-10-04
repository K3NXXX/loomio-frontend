import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
	return (
		<div className='flex flex-col gap-6 h-[476px]'>
			<div className='space-y-6'>
				<div className='space-y-2'>
					<label
						htmlFor='title'
						className='block text-sm font-medium text-gray-300 mb-2'
					>
						Title (required)
					</label>
					<Input
						id='title'
						type='text'
						defaultValue={fileName}
						placeholder='Enter a catchy title...'
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
						Description
					</label>
					<Textarea
						id='description'
						rows={6}
						placeholder='Write something about your video...'
						{...register('description')}
						className='min-h-[140px] text-base bg-neutral-800/80 border border-neutral-700 
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
						Tags
					</label>
					<Input
						id='tags'
						type='text'
						placeholder='e.g. #travel #vlog #music'
						{...register('tags')}
						className='h-14 text-base bg-neutral-800/80 border border-neutral-700 rounded-xl 
						text-white placeholder-gray-500 px-4 
						focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary 
						transition-colors'
					/>
					<p className='text-xs text-gray-500'>
						Use format: <span className='text-primary'>#top #live #music</span>
					</p>
				</div>
			</div>
		</div>
	)
}
