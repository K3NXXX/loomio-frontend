'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import Cropper, { type Area } from 'react-easy-crop'

interface CropBannerModalProps {
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

export function CropBannerModal({
	isOpen,
	onOpenChange,
	imageUrl,
	crop,
	zoom,
	onCropChange,
	onZoomChange,
	onCropComplete,
	onSave,
}: CropBannerModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='min-w-[900px] min-h-[700px] bg-neutral-900 text-white'>
				<DialogHeader>
					<DialogTitle>Adjust Banner</DialogTitle>
				</DialogHeader>

				<div className='relative w-full h-[450px] bg-black rounded-lg overflow-hidden'>
					{imageUrl && (
						<Cropper
							image={imageUrl}
							crop={crop}
							zoom={zoom}
							onCropChange={onCropChange}
							onZoomChange={onZoomChange}
							onCropComplete={onCropComplete}
							cropShape='rect'
							showGrid={false}
							objectFit='cover'
							// 20:6 ≈ 3.333...
							aspect={20 / 6}
						/>
					)}
				</div>

				{/* Zoom slider */}
				<div className='mt-4'>
					<input
						type='range'
						min={1}
						max={3}
						step={0.01}
						value={zoom}
						onChange={(e) => onZoomChange(Number(e.target.value))}
						className='w-full accent-primary cursor-pointer'
					/>
				</div>

				<div className='flex justify-end gap-3 mt-4'>
					<Button
						type='button'
						variant='secondary'
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button type='button' onClick={onSave}>
						Save
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
