'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
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
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-[500px] bg-neutral-900 text-white'>
				<DialogHeader>
					<DialogTitle>Adjust Avatar</DialogTitle>
				</DialogHeader>

				<div className='relative w-full h-[400px] bg-black rounded-lg overflow-hidden'>
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
							objectFit='cover'
							aspect={1}
						/>
					)}
				</div>

				{/* Зум */}
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
