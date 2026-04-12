'use client'

import loader from '@/assets/animations/loader.json'
import { CropAvatarModal } from '@/components/account/edit-account/CropAvatarModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/get-initials'
import { getCroppedImg } from '@/utils/getCroppedImage'
import Lottie from 'lottie-react'
import { useId, useRef, useState } from 'react'
import type { Area } from 'react-easy-crop'
import { FiTrash2 } from 'react-icons/fi'

interface AvatarUploaderProps {
	value?: string | null
	onChange?: (file: File | null, preview: string | null) => void
	fallbackName?: string
	isLoading?: boolean
}

export function AvatarUploader({
	value,
	onChange,
	fallbackName,
	isLoading,
}: AvatarUploaderProps) {
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
	const [isCropModalOpen, setIsCropModalOpen] = useState(false)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
	const [localPreview, setLocalPreview] = useState<string | null>(null)
	const inputId = useId()

	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const url = URL.createObjectURL(file)
			setTempImageUrl(url)
			setIsCropModalOpen(true)
		}
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const onCropComplete = (_: Area, croppedPixels: Area) => {
		setCroppedAreaPixels(croppedPixels)
	}

	const handleCropSave = async () => {
		if (tempImageUrl && croppedAreaPixels) {
			const croppedImage = await getCroppedImg(tempImageUrl, croppedAreaPixels)

			if (croppedImage) {
				setLocalPreview(croppedImage)

				const res = await fetch(croppedImage)
				const blob = await res.blob()
				const file = new File([blob], 'avatar.png', {
					type: blob.type,
				})

				onChange?.(file, croppedImage)
				setIsCropModalOpen(false)
			}
		}
	}

	const handleRemoveAvatar = () => {
		setLocalPreview(null)
		setTempImageUrl(null)
		onChange?.(null, null)
	}

	const src = localPreview || value || undefined

	return (
		<>
			<div className='flex flex-col items-center mb-3 text-center'>
				<div className='relative flex items-center justify-center'>
					<label
						htmlFor={inputId}
						className='relative w-32 h-32 shrink-0 rounded-full overflow-hidden 
						ring-2 ring-white/10 shadow-2xl cursor-pointer group 
						hover:scale-105 transition-transform'
					>
						<div className='absolute inset-0 bg-primary/20 blur-2xl scale-110 rounded-full' />

						<Avatar className='relative w-full h-full'>
							{isLoading ? (
								<div className='flex items-center justify-center w-full h-full bg-muted'>
									<Lottie animationData={loader} loop className='w-20 h-20' />
								</div>
							) : (
								<AvatarImage src={src} key={src || 'fallback'} />
							)}

							{!isLoading && (
								<AvatarFallback className='text-[25px] bg-neutral-800'>
									{getInitials(fallbackName)}
								</AvatarFallback>
							)}
						</Avatar>

						<div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
							<span className='text-white text-sm font-medium'>Change</span>
						</div>
					</label>

					{src && (
						<button
							type='button'
							onClick={handleRemoveAvatar}
							className='cursor-pointer absolute right-2 -bottom-5 -translate-y-1/2 
							bg-primary hover:bg-primary/80 text-white p-2 rounded-full shadow-md transition'
							title='Remove avatar'
						>
							<FiTrash2 className='w-4 h-4' />
						</button>
					)}
				</div>

				<input
					ref={fileInputRef}
					id={inputId}
					type='file'
					accept='image/*'
					className='hidden'
					onChange={handleAvatarChange}
				/>
			</div>

			<CropAvatarModal
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
		</>
	)
}
