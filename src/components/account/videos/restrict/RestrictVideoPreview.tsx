'use client'

import type { IVideo } from '@/types/video.types'
import { useVideoStore } from '@/zustand/store/videoStore'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

interface IEditVideoPreviewProps {
	previewUrl: string
	fileName: string
	video: IVideo
}

export function RestrictVideoPreview({
	previewUrl,
	video,
}: IEditVideoPreviewProps) {
	const t = useTranslations('editVideo.restrictPreview')
	const { thumbnailPreview, setVideoFile } = useVideoStore()
	const videoRef = useRef<HTMLVideoElement>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null)

	// input ref for new video upload
	const videoInputRef = useRef<HTMLInputElement>(null)

	const handlePlay = () => setIsPlaying(true)

	useEffect(() => {
		if (isPlaying && videoRef.current) {
			videoRef.current.play().catch(() => console.warn('Autoplay blocked'))
		}
	}, [isPlaying])

	useEffect(() => {
		setIsPlaying(false)
		if (videoRef.current) {
			videoRef.current.pause()
			videoRef.current.currentTime = 0
		}
	}, [thumbnailPreview, previewUrl])

	const handleNewVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const url = URL.createObjectURL(file)

		setLocalVideoUrl(url)
		setVideoFile(file)

		setIsPlaying(true)
	}

	return (
		<div className='flex flex-col items-end pt-7 gap-4'>
			{/* VIDEO PREVIEW */}
			<div className='relative w-full max-w-[400px] rounded-xl overflow-hidden border border-neutral-800 shadow-lg'>
				{!isPlaying && (thumbnailPreview || video.thumbnailFile) ? (
					<div
						className='relative w-full aspect-video cursor-pointer group'
						onClick={handlePlay}
					>
						<Image
							src={thumbnailPreview || video.thumbnailFile}
							alt={t('thumbnailOverlayAlt')}
							fill
							className='object-cover duration-300 group-hover:scale-105'
						/>
						<div className='absolute inset-0 flex items-center justify-center bg-black/40'>
							<div className='w-16 h-16 bg-white/80 rounded-full flex items-center justify-center'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									className='w-8 h-8 text-black translate-x-0.5 fill-current'
								>
									<path d='M8 5v14l11-7z' />
								</svg>
							</div>
						</div>
					</div>
				) : (
					<video
						ref={videoRef}
						src={localVideoUrl || previewUrl || video.videoFile}
						controls
						className='w-full h-[220px] object-cover bg-black'
					/>
				)}
			</div>

			{video.visibility === 'restricted' && (
				<>
					<button
						type='button'
						onClick={() => videoInputRef.current?.click()}
						className='px-6 py-2 text-sm rounded-lg bg-primary text-white font-semibold hover:bg-primary/80 transition cursor-pointer'
					>
						{t('uploadNewVideo')}
					</button>

					<input
						type='file'
						ref={videoInputRef}
						accept='video/*'
						className='hidden'
						onChange={handleNewVideoUpload}
					/>
				</>
			)}
		</div>
	)
}
