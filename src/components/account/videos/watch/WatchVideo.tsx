'use client'

import { useAddView } from '@/hooks/view/useAddView'
import 'plyr/dist/plyr.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

interface WatchVideoProps {
	videoSrc: string
	videoId: string
}

export function WatchVideo({ videoSrc, videoId }: WatchVideoProps) {
	const videoRef = useRef<HTMLVideoElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [aspectRatio, setAspectRatio] = useState<number | null>(null)
	const [isReady, setIsReady] = useState(false)
	const playerRef = useRef<any>(null)
	const hasSentView = useRef(false)
	const viewTimer = useRef<NodeJS.Timeout | null>(null)

	const { addView } = useAddView()

	useLayoutEffect(() => {
		const video = videoRef.current
		if (!video) return

		function handleMetadata() {
			setAspectRatio(video.videoWidth / video.videoHeight)
			setIsReady(true)
		}

		if (video.readyState >= 1) {
			handleMetadata()
		} else {
			video.addEventListener('loadedmetadata', handleMetadata, { once: true })
		}
	}, [videoSrc])

	useEffect(() => {
		if (!isReady || !videoRef.current) return

		async function loadPlayer() {
			const Plyr = (await import('plyr')).default
			if (!videoRef.current) return

			playerRef.current = new Plyr(videoRef.current, {
				controls: [
					'play-large',
					'play',
					'progress',
					'current-time',
					'mute',
					'volume',
					'settings',
					'fullscreen',
				],
				settings: ['quality', 'speed'],
				speed: {
					selected: 1,
					options: [0.5, 0.75, 1, 1.25, 1.5, 2],
				},
				quality: {
					default: 720,
					options: [360, 480, 720, 1080],
					forced: true,
				},
			})
		}

		loadPlayer()

		return () => {
			if (playerRef.current) playerRef.current.destroy()
		}
	}, [isReady])

	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		function handlePlay() {
			if (hasSentView.current) return

			// Запускаємо таймер на 5 секунд
			viewTimer.current = setTimeout(() => {
				addView(videoId)
				hasSentView.current = true
			}, 5000)
		}

		function handlePause() {
			if (viewTimer.current) {
				clearTimeout(viewTimer.current)
				viewTimer.current = null
			}
		}

		video.addEventListener('play', handlePlay)
		video.addEventListener('pause', handlePause)
		video.addEventListener('ended', handlePause)

		return () => {
			video.removeEventListener('play', handlePlay)
			video.removeEventListener('pause', handlePause)
			video.removeEventListener('ended', handlePause)
			if (viewTimer.current) clearTimeout(viewTimer.current)
		}
	}, [videoId, addView])

	useEffect(() => {
		function isTypingInEditable(e: KeyboardEvent) {
			const t = e.target as HTMLElement | null
			if (!t) return false
			const tag = t.tagName
			return (
				tag === 'INPUT' ||
				tag === 'TEXTAREA' ||
				tag === 'SELECT' ||
				(t as HTMLElement).isContentEditable ||
				t.getAttribute('role') === 'textbox'
			)
		}

		function handleKeyDown(e: KeyboardEvent) {
			if (isTypingInEditable(e)) return

			const player = playerRef.current
			if (!player) return

			if (e.ctrlKey || e.metaKey || e.altKey) return

			if (e.key.toLowerCase() === 'f') {
				const elem = containerRef.current
				if (!elem) return
				if (
					document.fullscreenElement === elem ||
					document.fullscreenElement === videoRef.current
				) {
					document.exitFullscreen()
				} else {
					if (elem.requestFullscreen) elem.requestFullscreen()
					else videoRef.current?.requestFullscreen?.()
				}
			}

			if (e.key.toLowerCase() === 'm') {
				player.muted = !player.muted
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	return (
		<div
			ref={containerRef}
			className='w-full max-w-full overflow-hidden rounded-xl bg-black transition-all duration-200'
			style={
				aspectRatio
					? { aspectRatio: `${aspectRatio}` }
					: { aspectRatio: '16/9' }
			}
		>
			<video
				ref={videoRef}
				src={videoSrc}
				className='w-full h-full object-contain opacity-0 transition-opacity duration-200'
				onCanPlay={() => videoRef.current?.classList.add('opacity-100')}
				controls
				autoPlay
				muted
				preload='auto'
			/>
		</div>
	)
}
