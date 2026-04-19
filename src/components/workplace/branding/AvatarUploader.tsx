'use client'

import { Button } from '@/components/ui/button'
import { getCroppedImg } from '@/utils/getCroppedImage'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'

export interface AvatarUploaderProps {
	initialUrl?: string | null
	valueUrl?: string | null
	onChange?: (file: File | null, previewUrl: string | null) => void
	maxSizeMB?: number
	minWidth?: number
	minHeight?: number
	outputSize?: number
	renderPreview?: boolean
}

function bytesToMB(n: number) {
	return n / (1024 * 1024)
}

type ValidateResult =
	| { ok: true }
	| { ok: false; kind: 'tooLarge' | 'tooSmall' | 'loadFailed' }

async function validateImage(
	file: File,
	minW: number,
	minH: number,
	maxMB: number,
): Promise<ValidateResult> {
	if (bytesToMB(file.size) > maxMB) return { ok: false, kind: 'tooLarge' }
	const url = URL.createObjectURL(file)
	try {
		const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
			const img = new Image()
			img.onload = () => resolve({ w: img.width, h: img.height })
			img.onerror = () => reject(new Error('load'))
			img.src = url
		})
		if (dims.w < minW || dims.h < minH)
			return { ok: false, kind: 'tooSmall' }
		return { ok: true }
	} catch {
		return { ok: false, kind: 'loadFailed' }
	} finally {
		URL.revokeObjectURL(url)
	}
}

export function AvatarUploader({
	initialUrl,
	valueUrl,
	onChange,
	maxSizeMB = 4,
	minWidth = 256,
	minHeight = 256,
	outputSize = 512,
	renderPreview = false,
}: AvatarUploaderProps) {
	const t = useTranslations('workplaceBranding.avatarUploader')
	const tRoot = useTranslations('workplaceBranding')
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [localUrl, setLocalUrl] = useState<string | null>(initialUrl ?? null)
	const [error, setError] = useState<string | null>(null)
	const [isCropOpen, setIsCropOpen] = useState(false)
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

	useEffect(() => {
		setLocalUrl(valueUrl ?? initialUrl ?? null)
	}, [valueUrl, initialUrl])

	const currentUrl = localUrl ?? null
	const openFileDialog = () => fileInputRef.current?.click()
	const onCropComplete = (_: Area, pixels: Area) => setCroppedAreaPixels(pixels)

	const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		const v = await validateImage(file, minWidth, minHeight, maxSizeMB)
		if (!v.ok) {
			if (v.kind === 'tooLarge') {
				setError(t('errors.fileTooLarge', { maxMB: maxSizeMB }))
			} else if (v.kind === 'tooSmall') {
				setError(
					t('errors.imageTooSmall', { minW: minWidth, minH: minHeight }),
				)
			} else {
				setError(t('errors.invalidImage'))
			}
			if (fileInputRef.current) fileInputRef.current.value = ''
			return
		}
		const url = URL.createObjectURL(file)
		setTempImageUrl(url)
		setIsCropOpen(true)
		setError(null)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const handleSaveCrop = async () => {
		if (!tempImageUrl || !croppedAreaPixels) return
		const croppedDataUrl = await getCroppedImg(
			tempImageUrl,
			croppedAreaPixels,
			{
				targetWidth: outputSize,
				targetHeight: outputSize,
			},
		)
		if (!croppedDataUrl) return
		const res = await fetch(croppedDataUrl)
		const blob = await res.blob()
		const file = new File([blob], 'avatar.png', {
			type: blob.type || 'image/png',
		})
		setLocalUrl(croppedDataUrl)
		onChange?.(file, croppedDataUrl)
		setIsCropOpen(false)
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
			{renderPreview && (
				<div className='flex items-center gap-4'>
					<div className='relative size-40 rounded-full overflow-hidden ring-1 ring-border bg-muted/20'>
						{currentUrl ? (
							<img
								src={currentUrl}
								alt={t('previewAlt')}
								className='w-full h-full object-cover'
							/>
						) : (
							<div className='w-full h-full grid place-items-center text-xs text-muted-foreground'>
								{t('aspectPlaceholder')}
							</div>
						)}
					</div>
				</div>
			)}

			{error && <p className='text-xs text-destructive'>{error}</p>}

			<div className='flex gap-2'>
				<input
					ref={fileInputRef}
					id='avatar-upload'
					type='file'
					accept='image/*'
					className='hidden'
					onChange={handleSelect}
				/>
				<Button
					type='button'
					className='rounded-full px-6'
					onClick={openFileDialog}
				>
					{currentUrl ? tRoot('change') : tRoot('upload')}
				</Button>
				{currentUrl && (
					<Button
						type='button'
						variant='outline'
						className='rounded-full px-6'
						onClick={handleRemove}
					>
						{tRoot('delete')}
					</Button>
				)}
			</div>

			<p className='text-xs text-muted-foreground'>
				{t('hintLine', {
					dims: `${Math.max(minWidth, 98)}×${Math.max(minHeight, 98)}px`,
					maxMb: `${maxSizeMB} MB`,
				})}
			</p>

			{isCropOpen && (
				<div className='fixed inset-0 z-[100] grid place-items-center bg-black/70'>
					<div className='w-[520px] rounded-xl bg-neutral-900 text-white p-4 shadow-2xl'>
						<h3 className='text-lg font-semibold mb-3'>{t('adjustTitle')}</h3>
						<div className='relative w-full h-[360px] bg-black rounded-lg overflow-hidden'>
							{tempImageUrl && (
								<Cropper
									image={tempImageUrl}
									crop={crop}
									zoom={zoom}
									onCropChange={setCrop}
									onZoomChange={setZoom}
									onCropComplete={onCropComplete}
									aspect={1}
									cropShape='round'
									showGrid={false}
									objectFit='contain'
								/>
							)}
						</div>
						<div className='mt-4'>
							<input
								type='range'
								min={1}
								max={3}
								step={0.01}
								value={zoom}
								onChange={(e) => setZoom(Number(e.target.value))}
								className='w-full accent-primary cursor-pointer'
							/>
						</div>
						<div className='flex justify-end gap-2 mt-4'>
							<Button
								type='button'
								variant='secondary'
								onClick={() => {
									setIsCropOpen(false)
									if (tempImageUrl) {
										URL.revokeObjectURL(tempImageUrl)
										setTempImageUrl(null)
									}
								}}
							>
								{tRoot('cancel')}
							</Button>
							<Button type='button' onClick={handleSaveCrop}>
								{tRoot('save')}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
