'use client'

import { AudienceInfoHint } from '@/components/account/videos/AudienceInfoHint'
import type { TUploadVideoSchema } from '@/schemas/videos/upload-video.schema'
import { getCroppedImg } from '@/utils/getCroppedImage'
import { useVideoStore } from '@/zustand/store/videoStore'
import { Globe, Lock, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
	const t = useTranslations()
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
	const [isCropModalOpen, setIsCropModalOpen] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)

	const [visibility, setVisibility] = useState<'public' | 'private'>('public')
	const [isForKids, setIsForKids] = useState<'yes' | 'no'>('no')

	const { thumbnailPreview, setThumbnailFile, setThumbnailPreview } =
		useVideoStore()

	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) handleFile(file)
	}

	const handleReplaceClick = () => fileInputRef.current?.click()

	const handleFile = (file: File) => {
		if (!file.type.startsWith('image/')) return

		const url = URL.createObjectURL(file)
		setTempImageUrl(url)
		setIsCropModalOpen(true)
	}

	const handleDeleteClick = () => {
		setThumbnailFile(null)
		setThumbnailPreview(null)
		setValue('thumbnail', [], { shouldValidate: true })
	}

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
		if (!file || !file.type.startsWith('image/')) return

		handleFile(file)
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
				<h3 className='text-lg font-semibold mb-3 text-foreground'>
					{t('uploadVideoModal.stepSecond.thumbnailTitle')}
				</h3>

				{thumbnailPreview ? (
					<div className='relative w-full max-w-[250px] group'>
						<div className='relative w-full aspect-video bg-black rounded-xl overflow-hidden'>
							<img
								src={thumbnailPreview ?? ''}
								alt={t('uploadVideoModal.stepSecond.thumbnailPreviewAlt')}
								className='object-cover w-full h-full'
							/>
							<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4'>
								<button
									type='button'
									onClick={handleReplaceClick}
									className='p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer'
									title={t('uploadVideoModal.stepSecond.changeThumbnailTitle')}
								>
									<FiEdit2 className='w-5 h-5' />
								</button>
								<button
									type='button'
									onClick={handleDeleteClick}
									className='p-2 rounded-full bg-white/20 hover:bg-red-600 transition text-white cursor-pointer'
									title={t('uploadVideoModal.stepSecond.deleteThumbnailTitle')}
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
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className={`
						border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition w-full max-w-[250px] aspect-video text-muted-foreground
						${
							isDragging
								? 'border-primary bg-primary/10 scale-[1.02]'
								: 'border-border hover:border-primary'
						}
					`}
					>
						<span className='mb-2 text-center'>
							{t('uploadVideoModal.stepSecond.clickUploadThumbnail')}
						</span>
						<span className='text-xs text-muted-foreground'>
							{t('uploadVideoModal.stepSecond.imageFormats')}
						</span>
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
				<h3 className='text-lg font-semibold mb-3 text-foreground'>
					{t('uploadVideoModal.stepSecond.visibilityTitle')}
				</h3>
				<div className='flex gap-4'>
					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[180px]
				${visibility === 'public' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
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
							<span className='text-foreground font-medium'>
								{t('uploadVideoModal.stepSecond.public')}
							</span>
							<span className='text-xs text-muted-foreground'>
								{t('uploadVideoModal.stepSecond.publicHint')}
							</span>
						</div>
					</label>

					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[180px]
				${visibility === 'private' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
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
							<span className='text-foreground font-medium'>
								{t('uploadVideoModal.stepSecond.private')}
							</span>
							<span className='text-xs text-muted-foreground'>
								{t('uploadVideoModal.stepSecond.privateHint')}
							</span>
						</div>
					</label>
				</div>
			</div>

			<div className='flex flex-col'>
				<div className='mb-3 flex items-center gap-2'>
					<h3 className='text-lg font-semibold text-foreground'>
						{t('uploadVideoModal.stepSecond.audienceTitle')}
					</h3>
					<AudienceInfoHint namespace='uploadVideoModal' />
				</div>
				<p className='text-sm text-muted-foreground mb-3'>
					{t('uploadVideoModal.stepSecond.audienceQuestion')}
				</p>
				<div className='flex gap-4'>
					{/* Yes */}
					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[180px]
				${isForKids === 'yes' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
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
							<span className='text-foreground font-medium'>
								{t('uploadVideoModal.stepSecond.yes')}
							</span>
							<span className='text-xs text-muted-foreground'>
								{t('uploadVideoModal.stepSecond.yesHint')}
							</span>
						</div>
					</label>

					<label
						className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition w-full max-w-[180px]
				${isForKids === 'no' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
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
							<span className='text-foreground font-medium'>
								{t('uploadVideoModal.stepSecond.no')}
							</span>
							<span className='text-xs text-muted-foreground'>
								{t('uploadVideoModal.stepSecond.noHint')}
							</span>
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
