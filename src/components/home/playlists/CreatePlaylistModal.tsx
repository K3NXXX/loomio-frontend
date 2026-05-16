'use client'

import loader from '@/assets/animations/loader.json'
import { CropVideoModal } from '@/components/account/videos/upload/CropVideoModal'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreatePlaylist } from '@/hooks/playlists/useCreatePlaylist'
import { useCreatePlaylistErrors } from '@/hooks/playlists/useCreatePlaylistErrors'
import {
	createPlaylistSchema,
	type TCreatePlaylistSchema,
} from '@/schemas/playlists/create-playlist.schema'
import type { ICreatePlaylistRequest } from '@/types/playlist.types'
import { getCroppedImg } from '@/utils/getCroppedImage'
import { zodResolver } from '@hookform/resolvers/zod'
import Lottie from 'lottie-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { type Area } from 'react-easy-crop'
import { useForm } from 'react-hook-form'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

interface CreatePlaylistModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	channelId?: string
}

export function CreatePlaylistModal({
	open,
	onOpenChange,
	channelId,
}: CreatePlaylistModalProps) {
	const t = useTranslations()
	const [isDragging, setIsDragging] = useState(false)
	const [coverPreview, setCoverPreview] = useState<string | null>(null)
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
	const [isCropModalOpen, setIsCropModalOpen] = useState(false)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { isSubmitting, isValid, errors },
	} = useForm<TCreatePlaylistSchema>({
		resolver: zodResolver(createPlaylistSchema),
		reValidateMode: 'onSubmit',
		defaultValues: { name: '', description: '', cover: null },
	})

	const { createPlaylist, isPending } = useCreatePlaylist()

	const handleFile = (file: File) => {
		if (!file.type.startsWith('image/')) return
		const url = URL.createObjectURL(file)
		setTempImageUrl(url)
		setIsCropModalOpen(true)
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		handleFile(file)
	}

	const handleCropComplete = (_: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels)
	}

	const handleCropSave = async () => {
		if (!tempImageUrl || !croppedAreaPixels) return

		const croppedImage = await getCroppedImg(tempImageUrl, croppedAreaPixels)
		if (!croppedImage) return

		if (typeof croppedImage === 'string') {
			const res = await fetch(croppedImage)
			const blob = await res.blob()
			const file = new File([blob], 'cover.png', { type: blob.type })
			setValue('cover', file, { shouldValidate: true })
			setCoverPreview(croppedImage)
		} else {
			const file = new File([croppedImage], 'cover.png', { type: 'image/png' })
			setValue('cover', file, { shouldValidate: true })
			setCoverPreview(URL.createObjectURL(croppedImage))
		}

		setIsCropModalOpen(false)
	}

	const handleDeleteCover = () => {
		setCoverPreview(null)
		setValue('cover', null, { shouldValidate: true })
	}

	const onSubmit = (data: ICreatePlaylistRequest) => {
		createPlaylist(
			{
				...data,
				channelId,
			},
			{
				onSuccess: () => {
					onOpenChange(false)
					reset()
					setCoverPreview(null)
				},
			},
		)
	}

	useCreatePlaylistErrors(errors)

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent
					onInteractOutside={(e) => e.preventDefault()}
					className='w-[calc(100%-1rem)] max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-2xl backdrop-blur-xl p-0'
				>
					<DialogHeader className='px-5 pt-5 pb-3 border-b border-border'>
						<DialogTitle className='text-base font-semibold text-foreground'>
							{t('playlists.createModalTitle')}
						</DialogTitle>
					</DialogHeader>

					<form
						//@ts-ignore
						onSubmit={handleSubmit(onSubmit)}
						className='p-5 flex flex-col gap-5'
					>
						<div className='flex flex-col gap-2'>
							<Label className='text-sm text-muted-foreground'>
								{t('playlists.coverLabel')}
							</Label>

							{coverPreview ? (
								<div className='relative w-full aspect-video rounded-xl overflow-hidden group'>
									<img
										src={coverPreview}
										alt='cover preview'
										className='w-full h-full object-cover'
									/>
									<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4'>
										<button
											type='button'
											onClick={() => fileInputRef.current?.click()}
											className='p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer'
										>
											<FiEdit2 className='w-5 h-5' />
										</button>
										<button
											type='button'
											onClick={handleDeleteCover}
											className='p-2 rounded-full bg-white/20 hover:bg-red-600 transition text-white cursor-pointer'
										>
											<FiTrash2 className='w-5 h-5' />
										</button>
									</div>
									<input
										type='file'
										ref={fileInputRef}
										accept='image/*'
										className='hidden'
										onChange={handleFileChange}
									/>
								</div>
							) : (
								<label
									htmlFor='cover'
									onDragOver={(e) => {
										e.preventDefault()
										setIsDragging(true)
									}}
									onDragLeave={() => setIsDragging(false)}
									onDrop={(e) => {
										e.preventDefault()
										setIsDragging(false)
										const file = e.dataTransfer.files?.[0]
										if (!file) return
										handleFile(file)
									}}
									className={`
										flex flex-col items-center justify-center w-full
										border-2 border-dashed rounded-2xl
										p-6 cursor-pointer transition-all duration-300
										${
											isDragging
												? 'border-primary bg-primary/10 scale-[1.02]'
												: 'border-border hover:border-primary hover:bg-muted/50'
										}
									`}
								>
									<div className='mb-4 bg-muted p-5 rounded-full'>
										<FaCloudUploadAlt className='text-primary text-5xl' />
									</div>
									<p className='text-muted-foreground text-sm font-medium'>
										{t('playlists.cover.dragDrop')}
									</p>
									<p className='text-muted-foreground text-xs mt-1'>
										{t('playlists.cover.orClick')}
									</p>
									<input
										type='file'
										id='cover'
										accept='image/*'
										className='hidden'
										onChange={handleFileChange}
									/>
								</label>
							)}
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='playlist-name'
								className='text-sm text-muted-foreground'
							>
								{t('playlists.nameLabel')}
							</Label>
							<Input
								id='playlist-name'
								placeholder={t('playlists.namePlaceholder')}
								className='bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary'
								{...register('name')}
							/>
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='playlist-description'
								className='text-sm text-muted-foreground'
							>
								{t('playlists.descriptionLabel')}
							</Label>
							<Textarea
								id='playlist-description'
								placeholder={t('playlists.descriptionPlaceholder')}
								className='bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary resize-none min-h-[80px]'
								{...register('description')}
							/>
						</div>

						<div className='flex justify-end gap-3 pt-3'>
							<Button
								type='button'
								variant='secondary'
								className='rounded-xl px-6 py-2.5'
								onClick={() => {
									onOpenChange(false)
									reset()
									setCoverPreview(null)
								}}
							>
								{t('common.cancel')}
							</Button>

							<Button
								type='submit'
								disabled={!isValid || isPending}
								className='bg-primary text-primary-foreground font-semibold rounded-xl px-6 py-2.5 hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none w-[180px]'
							>
								{isPending ? (
									<Lottie animationData={loader} loop className='w-20 h-20' />
								) : (
									t('playlists.createButton')
								)}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<CropVideoModal
				isOpen={isCropModalOpen}
				onOpenChange={setIsCropModalOpen}
				imageUrl={tempImageUrl}
				crop={crop}
				zoom={zoom}
				onCropChange={setCrop}
				onZoomChange={setZoom}
				onCropComplete={handleCropComplete}
				onSave={handleCropSave}
			/>
		</>
	)
}
