'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { ZoomIn } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Cropper, { type Area } from 'react-easy-crop'

interface CropVideoModalProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	imageUrl: string | null
	crop: { x: number; y: number }
	zoom: number
	onCropChange: (crop: { x: number; y: number }) => void
	onZoomChange: (zoom: number) => void
	onCropComplete: (_: Area, croppedAreaPixels: Area) => void
	onSave: () => void
}

export function CropVideoModal({
	isOpen,
	onOpenChange,
	imageUrl,
	crop,
	zoom,
	onCropChange,
	onZoomChange,
	onCropComplete,
	onSave,
}: CropVideoModalProps) {
	const t = useTranslations()
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-[700px] p-0 overflow-hidden border-white/10 bg-neutral-950 text-white rounded-2xl'>
				<div className='px-5 pt-5 pb-3 bg-gradient-to-b from-white/5 to-transparent'>
					<DialogHeader>
						<DialogTitle className='text-sm font-semibold tracking-wide uppercase text-white/50'>
							{t('uploadVideoModal.stepSecond.changeThumbnailTitle')}
						</DialogTitle>
					</DialogHeader>
				</div>

				<div className='relative mx-5 aspect-video rounded-xl overflow-hidden ring-1 ring-white/10'>
					{imageUrl && (
						<Cropper
							image={imageUrl}
							crop={crop}
							zoom={zoom}
							aspect={16 / 9}
							onCropChange={onCropChange}
							onZoomChange={onZoomChange}
							onCropComplete={onCropComplete}
							cropShape='rect'
							showGrid={false}
							objectFit='contain'
						/>
					)}
				</div>

				<div className='flex items-center gap-3 px-5 py-3'>
					<ZoomIn className='size-4 text-white/30 shrink-0' />
					<input
						type='range'
						min={1}
						max={3}
						step={0.01}
						value={zoom}
						onChange={(e) => onZoomChange(Number(e.target.value))}
						className='w-full accent-primary cursor-pointer'
					/>
					<span className='text-xs text-white/30 tabular-nums w-6 text-right'>
						{zoom.toFixed(1)}x
					</span>
				</div>

				<div className='flex items-center justify-end gap-2 px-5 py-4 border-t border-white/5'>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='text-white/50 hover:text-white hover:bg-white/8 rounded-lg'
						onClick={() => onOpenChange(false)}
					>
						{t('common.cancel')}
					</Button>
					<Button
						type='button'
						size='sm'
						className='bg-primary hover:bg-primary/90 text-white rounded-lg px-6 shadow-md shadow-primary/20'
						onClick={onSave}
					>
						{t('common.save')}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
