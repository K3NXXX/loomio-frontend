'use client'

import type { TUploadVideoSchema } from '@/schemas/videos/upload-video.schema'
import { getCroppedImg } from '@/utils/getCroppedImage'
import { useVideoStore } from '@/zustand/store/videoStore'
import { Globe, Lock, Users } from 'lucide-react'
import { useRef, useState } from 'react'
import { type Area } from 'react-easy-crop'
import type { UseFormSetValue } from 'react-hook-form'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { CropVideoModal } from './CropVideoModal'

interface UploadVideoStepSecondProps {
	setValue: UseFormSetValue<TUploadVideoSchema>
}

export function UploadVideoStepSecond({
	setValue,
}: UploadVideoStepSecondProps) {
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
	const [isCropModalOpen, setIsCropModalOpen] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [visibility, setVisibility] = useState<'public' | 'private'>('public')
	const [isForKids, setIsForKids] = useState<'yes' | 'no'>('no')

	const { thumbnailPreview, setThumbnailFile, setThumbnailPreview } =
		useVideoStore()

	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const url = URL.createObjectURL(file)
			setTempImageUrl(url)
			setIsCropModalOpen(true)
		}
	}

	const handleReplaceClick = () => fileInputRef.current?.click()

	const handleDeleteClick = () => {
		setThumbnailFile(null)
		setThumbnailPreview(null)
		setValue('thumbnail', [], { shouldValidate: true })
	}

	const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels)
	}

	const handleCropSave = async () => {
		if (tempImageUrl && croppedAreaPixels) {
			const croppedImage = await getCroppedImg(tempImageUrl, croppedAreaPixels)

			if (croppedImage) {
				if (typeof croppedImage === 'string') {
					const res = await fetch(croppedImage)
					const blob = await res.blob()
					const file = new File([blob], 'thumbnail.png', { type: blob.type })

					setValue('thumbnail', [file], { shouldValidate: true })
					setThumbnailPreview(croppedImage)
				} else {
					const file = new File([croppedImage], 'thumbnail.png', {
						type: 'image/png',
					})
					setValue('thumbnail', [file], { shouldValidate: true })
					setThumbnailPreview(URL.createObjectURL(croppedImage))
				}

				setIsCropModalOpen(false)
			}
		}
	}

	return (
		<div className='flex flex-col h-[700px] gap-8'>
			<div className='flex flex-col'>
				<h3 className='text-lg font-semibold mb-3 text-white'>
					Upload Thumbnail (required)
				</h3>

				{thumbnailPreview ? (
					<div className='relative w-full max-w-[250px] group'>
						<div className='relative w-full aspect-video bg-black rounded-xl overflow-hidden'>
							<img
								src={thumbnailPreview ?? ''}
								alt='Thumbnail Preview'
								className='object-cover w-full h-full'
							/>
							<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4'>
								<button
									type='button'
									onClick={handleReplaceClick}
									className='p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition'
									title='Change thumbnail'
								>
									<FiEdit2 className='w-5 h-5' />
								</button>
								<button
									type='button'
									onClick={handleDeleteClick}
									className='p-2 rounded-full bg-white/20 hover:bg-red-600 transition text-white'
									title='Delete thumbnail'
								>
									<FiTrash2 className='w-5 h-5' />
								</button>
							</div>
						</div>

						<input
							type='file'
							ref={fileInputRef}
							accept='image/*'
							className='hidden'
							onChange={handleThumbnailChange}
						/>
					</div>
				) : (
					<label
						htmlFor='thumbnail'
						className='border-2 border-dashed border-neutral-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition w-full max-w-[250px] aspect-video text-gray-400'
					>
						<span className='mb-2'>Click to upload thumbnail</span>
						<span className='text-xs text-gray-500'>(JPG, PNG, WEBP)</span>
						<input
							type='file'
							id='thumbnail'
							accept='image/*'
							className='hidden'
							onChange={handleThumbnailChange}
						/>
					</label>
				)}
			</div>

			<div className='flex flex-col'>
				<h3 className='text-lg font-semibold mb-3 text-white'>Visibility</h3>
				<div className='flex gap-4'>
					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[180px]
				${visibility === 'public' ? 'border-primary bg-primary/10' : 'border-neutral-700 hover:border-primary/50'}
			`}
					>
						<input
							type='radio'
							name='visibility'
							value='public'
							checked={visibility === 'public'}
							onChange={() => {
								setVisibility('public')
								setValue('visibility', 'public', { shouldValidate: true })
							}}
							className='hidden'
						/>
						<Globe className='w-5 h-5 text-primary' />
						<div className='flex flex-col'>
							<span className='text-white font-medium'>Public</span>
							<span className='text-xs text-gray-400'>Anyone can see</span>
						</div>
					</label>

					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[180px]
				${visibility === 'private' ? 'border-primary bg-primary/10' : 'border-neutral-700 hover:border-primary/50'}
			`}
					>
						<input
							type='radio'
							name='visibility'
							value='private'
							checked={visibility === 'private'}
							onChange={() => {
								setVisibility('private')
								setValue('visibility', 'private', { shouldValidate: true })
							}}
							className='hidden'
						/>
						<Lock className='w-5 h-5 text-primary' />
						<div className='flex flex-col'>
							<span className='text-white font-medium'>Private</span>
							<span className='text-xs text-gray-400'>Only you can see</span>
						</div>
					</label>
				</div>
			</div>

			<div className='flex flex-col'>
				<h3 className='text-lg font-semibold mb-3 text-white'>Audience</h3>
				<p className='text-sm text-gray-400 mb-3'>
					Is this video made for kids? (required)
				</p>
				<div className='flex gap-4'>
					{/* Yes */}
					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[180px]
				${isForKids === 'yes' ? 'border-primary bg-primary/10' : 'border-neutral-700 hover:border-primary/50'}
			`}
					>
						<input
							type='radio'
							name='audience'
							value='yes'
							checked={isForKids === 'yes'}
							onChange={() => {
								setIsForKids('yes')
								setValue('audience', 'yes', { shouldValidate: true })
							}}
							className='hidden'
						/>
						<Users className='w-5 h-5 text-primary' />
						<div className='flex flex-col'>
							<span className='text-white font-medium'>Yes</span>
							<span className='text-xs text-gray-400'>Made for kids</span>
						</div>
					</label>

					{/* No */}
					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[180px]
				${isForKids === 'no' ? 'border-primary bg-primary/10' : 'border-neutral-700 hover:border-primary/50'}
			`}
					>
						<input
							type='radio'
							name='audience'
							value='no'
							checked={isForKids === 'no'}
							onChange={() => {
								setIsForKids('no')
								setValue('audience', 'no', { shouldValidate: true })
							}}
							className='hidden'
						/>
						<Lock className='w-5 h-5 text-primary' />
						<div className='flex flex-col'>
							<span className='text-white font-medium'>No</span>
							<span className='text-xs text-gray-400'>Not made for kids</span>
						</div>
					</label>
				</div>
			</div>

			<CropVideoModal
				isOpen={isCropModalOpen}
				onOpenChange={setIsCropModalOpen}
				imageUrl={tempImageUrl}
				crop={crop}
				zoom={zoom}
				onCropChange={setCrop}
				onZoomChange={setZoom}
				onCropComplete={onCropComplete}
				onSave={handleCropSave}
			/>
		</div>
	)
}
