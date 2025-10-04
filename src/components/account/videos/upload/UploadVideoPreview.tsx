'use client'

import { useVideoStore } from '@/zustand/store/videoStore'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface IUploadVideoPreviewProps {
	previewUrl: string
	fileName: string
}

export function UploadVideoPreview({
	previewUrl,
	fileName,
}: IUploadVideoPreviewProps) {
	const { thumbnailPreview } = useVideoStore()
	const videoRef = useRef<HTMLVideoElement>(null)
	const [isPlaying, setIsPlaying] = useState(false)

	const handlePlay = () => {
		setIsPlaying(true)
	}

	useEffect(() => {
		if (isPlaying && videoRef.current) {
			videoRef.current.play().catch(() => {
				console.warn('Autoplay was prevented by the browser')
			})
		}
	}, [isPlaying])

	useEffect(() => {
		setIsPlaying(false)
		if (videoRef.current) {
			videoRef.current.pause()
			videoRef.current.currentTime = 0
		}
	}, [thumbnailPreview, previewUrl])

	return (
		<div className='flex flex-col items-end pt-7'>
			<div className='relative w-full max-w-[400px] rounded-xl overflow-hidden border border-neutral-800 shadow-lg'>
				{!isPlaying && thumbnailPreview ? (
					<div
						className='relative w-full aspect-video cursor-pointer group'
						onClick={handlePlay}
					>
						<Image
							src={thumbnailPreview}
							alt='Thumbnail Overlay'
							fill
							className='object-cover transition-transform duration-300 group-hover:scale-105'
						/>
						{/* ▶️ Play Button */}
						<div className='absolute inset-0 flex items-center justify-center bg-black/30'>
							<div className='w-16 h-16 bg-white/80 rounded-full flex items-center justify-center'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='currentColor'
									className='w-8 h-8 text-black translate-x-0.5'
								>
									<path d='M8 5v14l11-7z' />
								</svg>
							</div>
						</div>
					</div>
				) : (
					<video
						ref={videoRef}
						src={previewUrl}
						controls
						className='w-full max-h-[220px] object-cover bg-black'
					/>
				)}
			</div>

			<p className='font-medium pt-3 text-gray-400 truncate'>
				Filename: {fileName}
			</p>
		</div>
	)
}
