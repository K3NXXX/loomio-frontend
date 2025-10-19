import loader from '@/assets/animations/loader.json'
import { CropAvatarModal } from '@/components/account/edit-account/CropAvatarModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useDeleteAvatar } from '@/hooks/user/useDeleteAvatar'
import { useUpdateAvatar } from '@/hooks/user/useUpdateAvatar'
import type { IGetUserData } from '@/types/auth.types'
import { getInitials } from '@/utils/get-initials'
import { getCroppedImg } from '@/utils/getCroppedImage'
import Lottie from 'lottie-react'
import { useRef, useState } from 'react'
import type { Area } from 'react-easy-crop'
import { FiTrash2 } from 'react-icons/fi'

interface IAvatarUploaderProps {
	userData?: IGetUserData
	page: string
	onChange?: (url: string | null) => void
}

export function AvatarUploader({
	userData,
	page,
	onChange,
}: IAvatarUploaderProps) {
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
	const [isCropModalOpen, setIsCropModalOpen] = useState(false)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
	const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null)
	const [removed, setRemoved] = useState(false)

	const { updateAvatar, isUploadAvatarLoading } = useUpdateAvatar()
	const { deleteAvatar } = useDeleteAvatar()
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const url = URL.createObjectURL(file)
			setTempImageUrl(url)
			setIsCropModalOpen(true)
			setRemoved(false)
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
				setLocalAvatarUrl(croppedImage)
				const res = await fetch(croppedImage)
				const blob = await res.blob()
				const file = new File([blob], 'avatar.png', { type: blob.type })

				if (page === 'channel') {
				} else {
					updateAvatar(file)
				}

				onChange?.(croppedImage)
				setRemoved(false)
				setIsCropModalOpen(false)
			}
		}
	}

	const handleRemoveAvatar = () => {
		if (page === 'channel') {
		} else {
			deleteAvatar()
		}
		setLocalAvatarUrl(null)
		setTempImageUrl(null)
		setRemoved(true)
		onChange?.(null)
	}

	const src = removed
		? undefined
		: localAvatarUrl || userData?.avatarUrl || undefined

	return (
		<>
			<div className='flex flex-col items-center mb-3 text-center'>
				<div className='relative flex items-center justify-center'>
					<label
						htmlFor='avatar-upload'
						className='relative w-32 h-32 rounded-full overflow-hidden 
              ring-4 ring-primary/50 shadow-lg cursor-pointer group 
              hover:scale-105 transition-transform'
					>
						<Avatar className='w-full h-full'>
							{isUploadAvatarLoading ? (
								<div className='flex items-center justify-center w-full h-full bg-muted'>
									<Lottie animationData={loader} loop className='w-20 h-20' />
								</div>
							) : (
								<AvatarImage src={src} key={src || 'fallback'} />
							)}
							{!isUploadAvatarLoading && (
								<AvatarFallback className='text-[25px]'>
									{getInitials(userData?.name)}
								</AvatarFallback>
							)}
						</Avatar>
						<div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
							<span className='text-white text-sm font-medium'>Change</span>
						</div>
					</label>

					{(!!userData?.avatarUrl || !!localAvatarUrl) && !removed && (
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
					id='avatar-upload'
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
