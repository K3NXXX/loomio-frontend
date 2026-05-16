'use client'

import { Button } from '@/components/ui/button'
import { PAGES } from '@/constants/pages.constants'
import { useTranslations } from 'next-intl'
import { getCroppedImg } from '@/utils/getCroppedImage'
import { Lock } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { type Area } from 'react-easy-crop'
import { CropBannerModal } from './CropBannerModal'

export interface BannerUploaderProps {
	initialUrl?: string | null
	onChange?: (file: File | null, previewUrl?: string | null) => void
	maxSizeMB?: number
	gifMaxSizeMB?: number
	minWidth?: number
	minHeight?: number
	valueUrl?: string | null
	allowAnimatedBanner?: boolean
}

function isGifFile(file: File): boolean {
	return (
		file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif')
	)
}

export function BannerUploader({
	initialUrl,
	onChange,
	maxSizeMB = 6,
	gifMaxSizeMB = 12,
	minWidth = 2048,
	minHeight = 1152,
	valueUrl,
	allowAnimatedBanner = false,
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

	const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setError(null)

		if (isGifFile(file)) {
			if (!allowAnimatedBanner) {
				setError(t('animatedRequiresPremium'))
				if (fileInputRef.current) fileInputRef.current.value = ''
				return
			}
			if (file.size > gifMaxSizeMB * 1024 * 1024) {
				setError(t('gifTooLarge', { maxMb: gifMaxSizeMB }))
				if (fileInputRef.current) fileInputRef.current.value = ''
				return
			}
			const url = URL.createObjectURL(file)
			setLocalUrl(url)
			onChange?.(file, url)
			if (fileInputRef.current) fileInputRef.current.value = ''
			return
		}

		if (file.size > maxSizeMB * 1024 * 1024) {
			setError(t('staticTooLarge', { maxMb: maxSizeMB }))
			if (fileInputRef.current) fileInputRef.current.value = ''
			return
		}

		const url = URL.createObjectURL(file)

		setTempImageUrl(url)
		setIsCropModalOpen(true)

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

			{!allowAnimatedBanner && (
				<div
					className='rounded-xl border border-amber-500/35 bg-amber-500/[0.08] dark:bg-amber-500/[0.12] px-3 py-3 min-[500px]:px-4 min-[500px]:py-3.5 flex gap-3 items-start shadow-sm'
					role='status'
				>
					<div className='shrink-0 rounded-lg p-2 bg-amber-500/20 text-amber-800 dark:text-amber-200'>
						<Lock className='size-5' aria-hidden />
					</div>
					<div className='flex-1 min-w-0 space-y-1.5'>
						<p className='text-sm font-semibold text-amber-950 dark:text-amber-100'>
							{t('gifCalloutLockedTitle')}
						</p>
						<p className='text-xs text-muted-foreground leading-relaxed'>
							{t('gifCalloutLockedBody')}
						</p>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='mt-1 rounded-full border-yellow-400/50 text-yellow-700 bg-yellow-400/[0.08] hover:bg-yellow-400/[0.15] dark:border-yellow-400/35 dark:text-yellow-300 dark:bg-yellow-400/[0.1]'
							asChild
						>
							<Link href={`/${PAGES.PREMIUM_INFO}`}>{t('gifPremiumCta')}</Link>
						</Button>
					</div>
				</div>
			)}

			<div className='flex items-center justify-between gap-4 flex-wrap'>
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

			{allowAnimatedBanner && (
				<p className='text-xs text-muted-foreground/90 leading-relaxed max-w-[560px] -mt-0.5'>
					{t('animatedBannerHint', { maxMb: gifMaxSizeMB })}
				</p>
			)}

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
