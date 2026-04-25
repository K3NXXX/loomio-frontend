'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { getCroppedImg } from '@/utils/getCroppedImage'
import { useEffect, useRef, useState } from 'react'
import { type Area } from 'react-easy-crop'
import { CropBannerModal } from './CropBannerModal'

export interface BannerUploaderProps {
	initialUrl?: string | null
	onChange?: (file: File | null, previewUrl: string | null) => void
	maxSizeMB?: number
	minWidth?: number
	minHeight?: number
	valueUrl?: string | null
}

export function BannerUploader({
	initialUrl,
	onChange,
	maxSizeMB = 6,
	minWidth = 2048,
	minHeight = 1152,
	valueUrl,
}: BannerUploaderProps) {
	const t = useTranslations('workplaceBranding.bannerUploader')
	const tRoot = useTranslations('workplaceBranding')
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
	const [isCropModalOpen, setIsCropModalOpen] = useState(false)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
	const [localUrl, setLocalUrl] = useState<string | null>(initialUrl || null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setLocalUrl(valueUrl ?? initialUrl ?? null)
	}, [valueUrl, initialUrl])

	const currentUrl = localUrl ?? null

	const openFileDialog = () => fileInputRef.current?.click()

	// ⛔ NO VALIDATION ANYMORE
	const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const url = URL.createObjectURL(file)

		setTempImageUrl(url)
		setIsCropModalOpen(true)
		setError(null)

		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const onCropComplete = (_: Area, pixels: Area) => setCroppedAreaPixels(pixels)

	const handleSaveCrop = async () => {
		if (!tempImageUrl || !croppedAreaPixels) return
		const croppedDataUrl = await getCroppedImg(tempImageUrl, croppedAreaPixels)
		if (!croppedDataUrl) return

		const res = await fetch(croppedDataUrl)
		const blob = await res.blob()
		const file = new File([blob], 'banner.png', {
			type: blob.type || 'image/png',
		})

		setLocalUrl(croppedDataUrl)
		onChange?.(file, croppedDataUrl)
		setIsCropModalOpen(false)

		URL.revokeObjectURL(tempImageUrl)
		setTempImageUrl(null)
	}

	return (
		<div className='flex flex-col gap-3'>
			<div className='w-full aspect-[20/5] overflow-hidden rounded-2xl border border-border/40 shadow-sm mb-3 flex items-center justify-center bg-muted/10'>
				{currentUrl ? (
					<img
						src={currentUrl}
						alt={t('bannerAlt')}
						className='w-full h-full object-cover object-[center_5%]'
					/>
				) : (
					<span className='text-sm text-muted-foreground'>
						{t('recommendedWithDims', {
							dims: `${minWidth}×${minHeight}px`,
						})}
					</span>
				)}
			</div>

			{error && <p className='text-xs text-destructive'>{error}</p>}

			<div className='flex items-center justify-between'>
				<p className='text-sm text-muted-foreground leading-relaxed max-w-[500px]'>
					{t('specsLine', {
						dims: `${minWidth}×${minHeight}px`,
						maxMb: `${maxSizeMB} MB`,
					})}
				</p>

				<input
					ref={fileInputRef}
					id='banner-upload'
					type='file'
					accept='image/*'
					className='hidden'
					onChange={handleSelect}
				/>

				<Button
					type='button'
					className='rounded-full px-5'
					onClick={openFileDialog}
				>
					{currentUrl ? tRoot('change') : tRoot('upload')}
				</Button>
			</div>

			<CropBannerModal
				isOpen={isCropModalOpen}
				onOpenChange={setIsCropModalOpen}
				imageUrl={tempImageUrl}
				crop={crop}
				zoom={zoom}
				onCropChange={setCrop}
				onZoomChange={setZoom}
				onCropComplete={onCropComplete}
				onSave={handleSaveCrop}
			/>
		</div>
	)
}
