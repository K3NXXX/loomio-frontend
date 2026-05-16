'use client'

import { useAddView } from '@/hooks/view/useAddView'
import { watchMiniSnapshotRef } from '@/lib/watch-mini-player-snapshot'
import { useTranslations } from 'next-intl'
import 'plyr/dist/plyr.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const PREMIUM_SPEED_THRESHOLD = 3
const MAX_FREE_PLAYBACK_RATE = 2
const PREMIUM_SPEED_LOCK_ATTR = 'data-premium-speed-lock'
const PREMIUM_SPEED_CROWN_CLASS = 'plyr-speed-premium-crown'
const PREMIUM_SPEED_CROWN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>`

interface IWatchVideoProps {
	videoSrc: string
	videoId: string
	publicId: string
	videoTitle?: string
	canUseBoostSpeed?: boolean
	onNext?: () => void
}

function getBoostSpeedMenuButton(
	target: EventTarget | null,
	root: HTMLElement,
): HTMLButtonElement | null {
	const el = target as HTMLElement | null
	if (!el?.closest) return null
	const btn = el.closest(
		'button[role="menuitemradio"]',
	) as HTMLButtonElement | null
	if (!btn || !root.contains(btn)) return null
	if (!btn.closest('[id^="plyr-settings-"][id$="-speed"]')) return null
	const val = Number.parseFloat(String(btn.value ?? ''))
	if (!Number.isFinite(val) || val < PREMIUM_SPEED_THRESHOLD) return null
	return btn
}

function syncPremiumSpeedCrown(btn: HTMLButtonElement, show: boolean) {
	const existing = btn.querySelector(`:scope > .${PREMIUM_SPEED_CROWN_CLASS}`)
	if (!show) {
		existing?.remove()
		return
	}
	if (existing) return

	const wrap = document.createElement('span')
	wrap.className = PREMIUM_SPEED_CROWN_CLASS
	wrap.setAttribute('aria-hidden', 'true')
	wrap.innerHTML = PREMIUM_SPEED_CROWN_SVG
	btn.appendChild(wrap)
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

export function WatchVideo({
	videoSrc,
	videoId,
	videoTitle,
	canUseBoostSpeed = false,
	onNext,
}: IWatchVideoProps) {
	const isHls = videoSrc.includes('.m3u8')
	const t = useTranslations()
	const videoRef = useRef<HTMLVideoElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const plyrWrapperRef = useRef<HTMLDivElement>(null)
	const [aspectRatio, setAspectRatio] = useState<number | null>(null)
	const [isReady, setIsReady] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isPlyrReady, setIsPlyrReady] = useState(false)
	const [isPlyrMenuOpen, setIsPlyrMenuOpen] = useState(false)
	const playerRef = useRef<any>(null)
	const hlsRef = useRef<any>(null)
	const hasSentView = useRef(false)
	const viewTimer = useRef<NodeJS.Timeout | null>(null)
	const lastKnownPlayingRef = useRef(false)
	const snapshotMetaRef = useRef({
		canUseBoostSpeed,
		videoId,
		videoSrc,
		videoTitle,
		isHls,
	})
	snapshotMetaRef.current = {
		canUseBoostSpeed,
		videoId,
		videoSrc,
		videoTitle,
		isHls,
	}

	const { addView } = useAddView()

	useEffect(() => {
		if (!canUseBoostSpeed || !videoTitle) return

		function tick() {
			const el = videoRef.current
			if (!el) return
			lastKnownPlayingRef.current = !el.paused
			watchMiniSnapshotRef.current = {
				videoId,
				videoSrc,
				title: videoTitle,
				currentTime: el.currentTime,
				paused: el.paused,
				playbackRate: el.playbackRate,
				volume: el.volume,
				muted: el.muted,
				isHls,
			}
		}

		tick()
		const id = setInterval(tick, 300)
		return () => clearInterval(id)
	}, [canUseBoostSpeed, videoId, videoSrc, videoTitle, isHls])

	useEffect(() => {
		return () => {
			const m = snapshotMetaRef.current
			if (!m.canUseBoostSpeed || !m.videoTitle) return
			const el = videoRef.current
			const prevSnap = watchMiniSnapshotRef.current
			watchMiniSnapshotRef.current = {
				videoId: m.videoId,
				videoSrc: m.videoSrc,
				title: m.videoTitle,
				currentTime: el?.currentTime ?? prevSnap?.currentTime ?? 0,
				paused: el ? el.paused : !lastKnownPlayingRef.current,
				playbackRate: el?.playbackRate ?? prevSnap?.playbackRate ?? 1,
				volume: el?.volume ?? prevSnap?.volume ?? 1,
				muted: el?.muted ?? prevSnap?.muted ?? false,
				isHls: m.isHls,
			}
		}
	}, [])

	useLayoutEffect(() => {
		setIsReady(false)
		setIsLoading(true)
		setIsPlyrReady(false)
		hasSentView.current = false
		if (viewTimer.current) {
			clearTimeout(viewTimer.current)
			viewTimer.current = null
		}

		const video = videoRef.current
		if (!video) return

		function handleMetadata() {
			if (video.videoWidth > 0 && video.videoHeight > 0) {
				setAspectRatio(video.videoWidth / video.videoHeight)
			}
			if (!isHls) setIsReady(true)
		}

		if (!isHls) {
			video.load()
			if (video.readyState >= 1) {
				handleMetadata()
			} else {
				video.addEventListener('loadedmetadata', handleMetadata, { once: true })
			}
		}
	}, [videoSrc, isHls])

	useEffect(() => {
		const video = videoRef.current
		if (!video || isHls) return

		function onError() {
			setIsReady(true)
			setIsLoading(false)
		}

		video.addEventListener('error', onError)
		return () => video.removeEventListener('error', onError)
	}, [videoSrc, isHls])

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

	useEffect(() => {
		if (!isReady || !videoRef.current || !plyrWrapperRef.current) return

		if (playerRef.current) {
			playerRef.current.destroy()
			playerRef.current = null
		}

		let destroyed = false
		let plyrInstance: any = null
		let timeInterval: NodeJS.Timeout | null = null
		let handleBeforeUnload: (() => void) | null = null

		async function loadPlayer() {
			const Plyr = (await import('plyr')).default
			if (!videoRef.current || destroyed) return

			const hls = hlsRef.current
			const hasHlsQualities = Boolean(hls?.levels?.length)

			const controls = [
				'play-large',
				'play',
				'progress',
				'current-time',
				'mute',
				'volume',
				'settings',
				'fullscreen',
			] as const

			const speed = {
				selected: 1,
				options: [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4],
			}

			const quality =
				hasHlsQualities && hls
					? {
							default:
								hls.levels[hls.currentLevel]?.height ??
								(hls.levels.map((l: any) => l.height).at(-1) as number),
							options: hls.levels.map((l: any) => l.height),
							forced: true as const,
							onChange: (newQuality: number) => {
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
						}
					: undefined

			if (destroyed || !videoRef.current) return

			plyrInstance = new Plyr(videoRef.current, {
				controls: [...controls],
				settings: hasHlsQualities
					? (['quality', 'speed'] as const)
					: (['speed'] as const),
				speed,
				...(quality ? { quality } : {}),
			})
			playerRef.current = plyrInstance

			plyrInstance.on('ready', () => {
				plyrInstance.volume = getSavedVolume()

				setIsPlyrReady(true)
			})

			plyrInstance.on('canplay', () => {
				const savedTime = getSavedTime(videoId)
				if (savedTime > 0 && plyrInstance.currentTime < 1) {
					plyrInstance.currentTime = savedTime
				}
			})

			timeInterval = setInterval(() => {
				if (plyrInstance && !plyrInstance.paused) {
					setSavedTime(videoId, plyrInstance.currentTime)
				}
			}, 5000)

			plyrInstance.on('volumechange', () => {
				localStorage.setItem('video_volume', String(plyrInstance.volume))
			})

			plyrInstance.on('ended', () => {
				removeSavedTime(videoId)
			})

			plyrInstance.on('pause', () => {
				setSavedTime(videoId, plyrInstance.currentTime)
			})

			handleBeforeUnload = () => {
				if (plyrInstance) {
					setSavedTime(videoId, plyrInstance.currentTime)
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
			const p = plyrInstance
			plyrInstance = null
			if (p) {
				try {
					p.destroy()
				} catch {
				}
			}
			if (playerRef.current === p) {
				playerRef.current = null
			}
		}
	}, [isReady, isHls, videoId, videoSrc])

	useEffect(() => {
		const wrap = plyrWrapperRef.current
		if (!wrap || !isPlyrReady) return

		const lockedHint = t('watchVideo.premiumSpeedTooltip')

		function applyPremiumVisualLock() {
			const panel = wrap.querySelector('[id^="plyr-settings-"][id$="-speed"]')
			if (!panel) return

			panel
				.querySelectorAll('button[role="menuitemradio"]')
				.forEach((node) => {
					const btn = node as HTMLButtonElement
					const val = Number.parseFloat(String(btn.value ?? ''))
					const isBoost =
						Number.isFinite(val) && val >= PREMIUM_SPEED_THRESHOLD
					if (!isBoost) return

					if (!canUseBoostSpeed) {
						btn.classList.add('plyr-speed-premium-locked')
						btn.setAttribute('aria-disabled', 'true')
						btn.setAttribute(PREMIUM_SPEED_LOCK_ATTR, '')
						btn.title = lockedHint
						syncPremiumSpeedCrown(btn, true)
					} else {
						btn.classList.remove('plyr-speed-premium-locked')
						btn.removeAttribute('aria-disabled')
						syncPremiumSpeedCrown(btn, false)
						if (btn.hasAttribute(PREMIUM_SPEED_LOCK_ATTR)) {
							btn.removeAttribute(PREMIUM_SPEED_LOCK_ATTR)
							btn.removeAttribute('title')
						}
					}
				})
		}

		function blockBoostSpeedInteraction(ev: Event) {
			if (canUseBoostSpeed) return
			if (ev instanceof KeyboardEvent) {
				if (ev.key !== 'Enter' && ev.key !== ' ') return
			}
			if (!getBoostSpeedMenuButton(ev.target, wrap)) return
			ev.preventDefault()
			ev.stopPropagation()
			ev.stopImmediatePropagation()
		}

		applyPremiumVisualLock()

		const mo = new MutationObserver(() => applyPremiumVisualLock())
		mo.observe(wrap, { subtree: true, childList: true })

		wrap.addEventListener('click', blockBoostSpeedInteraction, true)
		wrap.addEventListener('keyup', blockBoostSpeedInteraction, true)
		wrap.addEventListener('keydown', blockBoostSpeedInteraction, true)

		return () => {
			mo.disconnect()
			wrap.removeEventListener('click', blockBoostSpeedInteraction, true)
			wrap.removeEventListener('keyup', blockBoostSpeedInteraction, true)
			wrap.removeEventListener('keydown', blockBoostSpeedInteraction, true)
		}
	}, [isPlyrReady, canUseBoostSpeed, videoId, t])

	useEffect(() => {
		const video = videoRef.current
		if (!video || !isPlyrReady || canUseBoostSpeed) return

		function clampPlaybackRate() {
			const p = playerRef.current
			if (!video || !p) return
			if (video.playbackRate > MAX_FREE_PLAYBACK_RATE + 0.01) {
				video.playbackRate = MAX_FREE_PLAYBACK_RATE
				p.speed = MAX_FREE_PLAYBACK_RATE
			}
		}

		clampPlaybackRate()
		video.addEventListener('ratechange', clampPlaybackRate)
		return () => video.removeEventListener('ratechange', clampPlaybackRate)
	}, [isPlyrReady, canUseBoostSpeed, videoId])

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

			if (e.code === 'ArrowRight') {
				player.currentTime = Math.min(player.currentTime + 15, player.duration)
			}

			if (e.code === 'ArrowLeft') {
				player.currentTime = Math.max(player.currentTime - 15, 0)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

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
			{(isLoading || !isPlyrReady) && (
				<div className='absolute inset-0 z-10 flex items-center justify-center bg-black pointer-events-none'>
					<div className='w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin' />
				</div>
			)}

			<div
				ref={plyrWrapperRef}
				className='w-full h-full relative'
				style={{ visibility: isPlyrReady ? 'visible' : 'hidden' }}
			>
				<div
					className={`absolute left-0 top-50 w-32 h-[30%] z-20 flex items-center justify-start pl-8 opacity-0 hover:opacity-100 transition-opacity cursor-pointer ${isPlyrMenuOpen ? 'pointer-events-none' : ''}`}
					onClick={() => {
						if (isPlyrMenuOpen) return
						const player = playerRef.current
						if (!player) return
						player.currentTime = Math.max(player.currentTime - 15, 0)
					}}
				>
					<div className='bg-black/40 backdrop-blur-xl rounded-2xl px-5 py-4 flex flex-col items-center gap-1 border border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-black/60'>
						<FiChevronLeft className='text-white w-7 h-7 transition-transform duration-300 group-hover:-translate-x-1' />

						<span className='text-white font-semibold text-sm tracking-wide'>
							{t('watchVideo.skipSeconds', { count: 15 })}
						</span>
					</div>
				</div>

				<div
					className={`absolute right-0 top-50 w-32 h-[30%] z-20 flex items-center justify-end pr-8 opacity-0 hover:opacity-100 transition-opacity cursor-pointer ${isPlyrMenuOpen ? 'pointer-events-none' : ''}`}
					onClick={() => {
						if (isPlyrMenuOpen) return
						const player = playerRef.current
						if (!player) return
						player.currentTime = Math.min(
							player.currentTime + 15,
							player.duration,
						)
					}}
				>
					<div className='bg-black/40 backdrop-blur-xl rounded-2xl px-5 py-4 flex flex-col items-center gap-1 border border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-black/60'>
						<FiChevronRight className='text-white w-7 h-7 transition-transform duration-300 group-hover:translate-x-1' />

						<span className='text-white font-semibold text-sm tracking-wide'>
							{t('watchVideo.skipSeconds', { count: 15 })}
						</span>
					</div>
				</div>

				<video
					key={videoSrc}
					ref={videoRef}
					src={isHls ? undefined : videoSrc}
					className='w-full h-full object-contain'
					onCanPlay={() => setIsLoading(false)}
					onWaiting={() => setIsLoading(true)}
					onPlaying={() => setIsLoading(false)}
					controls
					autoPlay
					muted
					playsInline
					preload='auto'
				/>
			</div>
		</div>
	)
}
