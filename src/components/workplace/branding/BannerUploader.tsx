import { Button } from '@/components/ui/button'
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

function bytesToMB(n: number) {
	return n / (1024 * 1024)
}

async function validateImage(
	file: File,
	minW: number,
	minH: number,
	maxMB: number,
) {
	if (bytesToMB(file.size) > maxMB) {
		return { ok: false, error: `File is too large. Max ${maxMB} MB.` }
	}
	const url = URL.createObjectURL(file)
	try {
		const img = new Image()
		const dims: { w: number; h: number } = await new Promise(
			(resolve, reject) => {
				img.onload = () => resolve({ w: img.width, h: img.height })
				img.onerror = reject
				img.src = url
			},
		)
		if (dims.w < minW || dims.h < minH) {
			return { ok: false, error: `Image too small. Minimum ${minW}×${minH}px.` }
		}
	} finally {
		URL.revokeObjectURL(url)
	}
	return { ok: true as const }
}

export function BannerUploader({
	initialUrl,
	onChange,
	maxSizeMB = 6,
	minWidth = 2048,
	minHeight = 1152,
	valueUrl,
}: BannerUploaderProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
	const [isCropModalOpen, setIsCropModalOpen] = useState(false)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
	const [localUrl, setLocalUrl] = useState<string | null>(initialUrl || null)
	const [error, setError] = useState<string | null>(null)

	// 🧠 Синхронізуємо localUrl з valueUrl (контроль зверху)
	useEffect(() => {
		setLocalUrl(valueUrl ?? initialUrl ?? null)
	}, [valueUrl, initialUrl])

	const currentUrl = localUrl ?? null

	const openFileDialog = () => fileInputRef.current?.click()

	const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const v = await validateImage(file, minWidth, minHeight, maxSizeMB)
		if (!v.ok) {
			setError(v.error || 'Invalid image')
			if (fileInputRef.current) fileInputRef.current.value = ''
			return
		}

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

	const handleRemove = () => {
		setLocalUrl(null)
		onChange?.(null, null)
		setError(null)
	}

	return (
		<div className='flex flex-col gap-3'>
			<div className='relative w-full aspect-[20/6] rounded-xl border border-dashed border-border/50 bg-muted/10 overflow-hidden flex items-center justify-center group'>
				{currentUrl ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={currentUrl}
						alt='Channel banner'
						className='absolute inset-0 w-full h-full object-cover'
					/>
				) : (
					<span className='text-sm text-muted-foreground'>
						Recommended size:{' '}
						<b>
							{minWidth}×{minHeight} px
						</b>
					</span>
				)}
			</div>

			{error && <p className='text-xs text-destructive'>{error}</p>}

			<div className='flex items-center justify-between'>
				<p className='text-sm text-muted-foreground leading-relaxed max-w-[500px]'>
					To ensure your banner looks great on all devices, upload at least{' '}
					<b>
						{minWidth}×{minHeight}px
					</b>
					. Max file size <b>{maxSizeMB} MB</b>.
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
					{currentUrl ? 'Change' : 'Upload'}
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
