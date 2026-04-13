'use client'

import { useAddView } from '@/hooks/view/useAddView'
import 'plyr/dist/plyr.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

interface IWatchVideoProps {
	videoSrc: string
	videoId: string
	publicId: string
	onNext?: () => void
}

function getSavedTime(videoId: string): number {
	try {
		const all = JSON.parse(localStorage.getItem('video_times') || '{}')
		return all[videoId] ?? 0
	} catch {
		return 0
	}
}

function setSavedTime(videoId: string, time: number) {
	try {
		const all = JSON.parse(localStorage.getItem('video_times') || '{}')
		all[videoId] = time
		localStorage.setItem('video_times', JSON.stringify(all))
	} catch {}
}

function removeSavedTime(videoId: string) {
	try {
		const all = JSON.parse(localStorage.getItem('video_times') || '{}')
		delete all[videoId]
		localStorage.setItem('video_times', JSON.stringify(all))
	} catch {}
}

function getSavedVolume(): number {
	try {
		return parseFloat(localStorage.getItem('video_volume') || '1') || 1
	} catch {
		return 1
	}
}

export function WatchVideo({ videoSrc, videoId, onNext }: IWatchVideoProps) {
	const videoRef = useRef<HTMLVideoElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const plyrWrapperRef = useRef<HTMLDivElement>(null)
	const [aspectRatio, setAspectRatio] = useState<number | null>(null)
	const [isReady, setIsReady] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isPlyrReady, setIsPlyrReady] = useState(false)
	const playerRef = useRef<any>(null)
	const hlsRef = useRef<any>(null)
	const hasSentView = useRef(false)
	const viewTimer = useRef<NodeJS.Timeout | null>(null)

	const { addView } = useAddView()

	const isHls = videoSrc.includes('.m3u8')

	useEffect(() => {
		setIsReady(false)
		setIsLoading(true)
		setIsPlyrReady(false)
		hasSentView.current = false
		if (viewTimer.current) {
			clearTimeout(viewTimer.current)
			viewTimer.current = null
		}
	}, [videoSrc])

	useLayoutEffect(() => {
		const video = videoRef.current
		if (!video) return

		function handleMetadata() {
			if (video) {
				setAspectRatio(video.videoWidth / video.videoHeight)
			}
			if (!isHls) setIsReady(true)
		}

		if (video.readyState >= 1) {
			handleMetadata()
		} else {
			video.addEventListener('loadedmetadata', handleMetadata, { once: true })
		}
	}, [videoSrc, isHls])

	// HLS setup ppppppppppppppppp
	useEffect(() => {
		if (!isHls || !videoRef.current) return

		let hls: any = null

		async function setupHls() {
			const Hls = (await import('hls.js')).default
			if (!videoRef.current) return

			if (Hls.isSupported()) {
				hls = new Hls({ startLevel: -1 })
				hlsRef.current = hls

				hls.loadSource(videoSrc)
				hls.attachMedia(videoRef.current)

				hls.on(Hls.Events.MANIFEST_PARSED, () => {
					console.log(
						'Доступні якості:',
						hls.levels.map((l: any) => `${l.height}p`),
					)
					setIsReady(true)
				})
			} else if (
				videoRef.current.canPlayType('application/vnd.apple.mpegurl')
			) {
				videoRef.current.src = videoSrc
				setIsReady(true)
			}
		}

		setupHls()

		return () => {
			if (hls) {
				hls.destroy()
				hlsRef.current = null
			}
		}
	}, [videoSrc, isHls])

	// Plyr setup
	useEffect(() => {
		if (!isReady || !videoRef.current || !plyrWrapperRef.current) return

		if (playerRef.current) {
			playerRef.current.destroy()
			playerRef.current = null
		}

		let destroyed = false
		let timeInterval: NodeJS.Timeout | null = null
		let handleBeforeUnload: (() => void) | null = null

		async function loadPlayer() {
			const Plyr = (await import('plyr')).default
			if (!videoRef.current || destroyed) return

			const hls = hlsRef.current

			let qualityOptions: number[] = [360, 480, 720, 1080]
			let defaultQuality = 720

			if (hls && hls.levels?.length) {
				qualityOptions = hls.levels.map((l: any) => l.height)
				defaultQuality =
					hls.levels[hls.currentLevel]?.height ??
					qualityOptions[qualityOptions.length - 1]
			}

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
					default: defaultQuality,
					options: qualityOptions,
					forced: true,
					onChange: (newQuality: number) => {
						if (!hls) return
						if (newQuality === 0) {
							hls.currentLevel = -1
						} else {
							const levelIndex = hls.levels.findIndex(
								(l: any) => l.height === newQuality,
							)
							if (levelIndex !== -1) {
								hls.currentLevel = levelIndex
							}
						}
					},
				},
			})

			playerRef.current.on('ready', () => {
				playerRef.current.volume = getSavedVolume()

				setIsPlyrReady(true)
			})

			playerRef.current.on('canplay', () => {
				const savedTime = getSavedTime(videoId)
				if (savedTime > 0 && playerRef.current.currentTime < 1) {
					playerRef.current.currentTime = savedTime
				}
			})

			timeInterval = setInterval(() => {
				if (playerRef.current && !playerRef.current.paused) {
					setSavedTime(videoId, playerRef.current.currentTime)
				}
			}, 5000)

			playerRef.current.on('volumechange', () => {
				localStorage.setItem('video_volume', String(playerRef.current.volume))
			})

			playerRef.current.on('ended', () => {
				removeSavedTime(videoId)
			})

			playerRef.current.on('pause', () => {
				setSavedTime(videoId, playerRef.current.currentTime)
			})

			handleBeforeUnload = () => {
				if (playerRef.current) {
					setSavedTime(videoId, playerRef.current.currentTime)
				}
			}
			window.addEventListener('beforeunload', handleBeforeUnload)
		}

		loadPlayer()

		return () => {
			destroyed = true
			if (timeInterval) clearInterval(timeInterval)
			if (handleBeforeUnload)
				window.removeEventListener('beforeunload', handleBeforeUnload)
			setTimeout(() => {
				if (playerRef.current) {
					playerRef.current.destroy()
					playerRef.current = null
				}
			}, 0)
		}
	}, [isReady, isHls, videoId])

	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		function handlePlay() {
			if (hasSentView.current) return
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
		video.addEventListener('pause', handlePlay)
		video.addEventListener('ended', handlePause)

		return () => {
			video.removeEventListener('play', handlePlay)
			video.removeEventListener('pause', handlePause)
			video.removeEventListener('ended', handlePause)
			if (viewTimer.current) clearTimeout(viewTimer.current)
		}
	}, [videoId, addView])

	// Keyboard shortcuts
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

			if (e.code === 'KeyF') {
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

			if (e.code === 'KeyM') {
				player.muted = !player.muted
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	// On video ended → next
	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		function handleEnded() {
			if (onNext) onNext()
		}

		video.addEventListener('ended', handleEnded)
		return () => video.removeEventListener('ended', handleEnded)
	}, [onNext])

	return (
		<div
			ref={containerRef}
			className='relative w-full max-w-full overflow-hidden rounded-xl bg-black transition-all duration-200'
			style={
				aspectRatio
					? { aspectRatio: `${aspectRatio}` }
					: { aspectRatio: '16/9' }
			}
		>
			{/* Лоадер поки відео або Plyr не готові */}
			{(isLoading || !isPlyrReady) && (
				<div className='absolute inset-0 z-10 flex items-center justify-center bg-black pointer-events-none'>
					<div className='w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin' />
				</div>
			)}

			<div
				ref={plyrWrapperRef}
				className='w-full h-full'
				style={{ visibility: isPlyrReady ? 'visible' : 'hidden' }}
			>
				<video
					ref={videoRef}
					src={isHls ? undefined : videoSrc}
					className='w-full h-full object-contain'
					onCanPlay={() => setIsLoading(false)}
					onWaiting={() => setIsLoading(true)}
					onPlaying={() => setIsLoading(false)}
					controls
					autoPlay
					muted
					preload='auto'
				/>
			</div>
		</div>
	)
}
