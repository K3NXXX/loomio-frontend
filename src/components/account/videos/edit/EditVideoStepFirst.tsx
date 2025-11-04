import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { TEditVideoSchema } from '@/schemas/videos/edit-video.schema'
import type { IVideo } from '@/types/video.types'
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
	console.log(video)
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
						defaultValue={video.title}
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
						defaultValue={video.description ? video.description : ''}
						placeholder='Write something about your video...'
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
						Tags
					</label>
					<Input
						id='tags'
						type='text'
						placeholder='e.g. #travel #vlog #music'
						defaultValue={video.tags ? video.tags : ''}
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
