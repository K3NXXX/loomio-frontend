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

interface CropAvatarModalProps {
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

export function CropAvatarModal({
	isOpen,
	onOpenChange,
	imageUrl,
	crop,
	zoom,
	onCropChange,
	onZoomChange,
	onCropComplete,
	onSave,
}: CropAvatarModalProps) {
	const t = useTranslations()
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-[380px] p-0 overflow-hidden border-border bg-card text-card-foreground rounded-2xl'>
				<div className='px-5 pt-5 pb-3 border-b border-border'>
					<DialogHeader>
						<DialogTitle className='text-sm font-semibold tracking-wide uppercase text-muted-foreground'>
							{t('common.cropAvatar')}
						</DialogTitle>
					</DialogHeader>
				</div>

				<div className='relative mx-5 aspect-square rounded-xl overflow-hidden ring-1 ring-border bg-black'>
					{imageUrl && (
						<Cropper
							image={imageUrl}
							crop={crop}
							zoom={zoom}
							onCropChange={onCropChange}
							onZoomChange={onZoomChange}
							onCropComplete={onCropComplete}
							cropShape='round'
							showGrid={false}
							objectFit='contain'
							aspect={1}
						/>
					)}
				</div>

				<div className='flex items-center gap-3 px-5 py-3'>
					<ZoomIn className='size-4 text-muted-foreground shrink-0' />
					<input
						type='range'
						min={1}
						max={3}
						step={0.01}
						value={zoom}
						onChange={(e) => onZoomChange(Number(e.target.value))}
						className='w-full accent-primary cursor-pointer'
					/>
					<span className='text-xs text-muted-foreground tabular-nums w-6 text-right'>
						{zoom.toFixed(1)}x
					</span>
				</div>

				<div className='flex items-center justify-end gap-2 px-5 py-4 border-t border-border'>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg'
						onClick={() => onOpenChange(false)}
					>
						{t('common.cancel')}
					</Button>
					<Button
						type='button'
						size='sm'
						className='rounded-lg px-6 shadow-md shadow-primary/20'
						onClick={onSave}
					>
						{t('common.save')}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
