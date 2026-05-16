'use client'

import { Button } from '@/components/ui/button'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useMiniPlayerStore } from '@/zustand/store/miniPlayerStore'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import 'plyr/dist/plyr.css'
import { useEffect, useRef, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { LuMaximize2 } from 'react-icons/lu'

function readSavedVolume(): number {
	try {
		return parseFloat(localStorage.getItem('video_volume') || '1') || 1
	} catch {
		return 1
	}
}

export function PremiumMiniPlayer() {
	const t = useTranslations('miniPlayer')
	const { userData, authReady } = useGetMe()
	const premium = Boolean(userData?.isPremium)

	const active = useMiniPlayerStore((s) => s.active)
	const clear = useMiniPlayerStore((s) => s.clear)

	const videoRef = useRef<HTMLVideoElement>(null)
	const hlsRef = useRef<{ destroy: () => void } | null>(null)
	const playerRef = useRef<any>(null)

	const [mediaReady, setMediaReady] = useState(false)
	const [needsTapPlay, setNeedsTapPlay] = useState(false)

	useEffect(() => {
		if (authReady && !premium && active) {
			clear()
		}
	}, [authReady, premium, active, clear])

	useEffect(() => {
		if (!active) {
			setMediaReady(false)
			return
		}

		setMediaReady(false)

		const video = videoRef.current
		if (!video) return

		const { videoSrc, isHls } = active

		let cancelled = false

		function markReady() {
			if (!cancelled) setMediaReady(true)
		}

		function onLoadedMeta() {
			markReady()
		}

		async function setup() {
			if (!isHls) {
				video.src = videoSrc
				video.addEventListener('loadedmetadata', onLoadedMeta, {
					once: true,
				})
				return
			}

			const Hls = (await import('hls.js')).default
			if (cancelled || !videoRef.current) return

			if (Hls.isSupported()) {
				const hls = new Hls({ startLevel: -1 })
				hlsRef.current = hls
				hls.loadSource(videoSrc)
				hls.attachMedia(video)
				hls.on(Hls.Events.MANIFEST_PARSED, () => {
					video.addEventListener('loadedmetadata', onLoadedMeta, {
						once: true,
					})
				})
			} else if (
				video.canPlayType('application/vnd.apple.mpegurl')
			) {
				video.src = videoSrc
				video.addEventListener('loadedmetadata', onLoadedMeta, {
					once: true,
				})
			}
		}

		void setup()

		return () => {
			cancelled = true
			video.removeEventListener('loadedmetadata', onLoadedMeta)
			const hls = hlsRef.current
			if (hls) {
				hls.destroy()
				hlsRef.current = null
			}
			video.removeAttribute('src')
			video.load()
		}
	}, [active?.videoId, active?.videoSrc, active?.isHls])

	useEffect(() => {
		if (!mediaReady || !videoRef.current) return

		const snap = useMiniPlayerStore.getState().active
		if (!snap) return

		const video = videoRef.current
		let destroyed = false

		async function loadPlyr() {
			const Plyr = (await import('plyr')).default
			if (!videoRef.current || destroyed) return

			const hls = hlsRef.current

			let qualityOptions: number[] = [360, 480, 720, 1080]
			let defaultQuality = 720

			if (hls && (hls as any).levels?.length) {
				const levels = (hls as any).levels
				qualityOptions = levels.map((l: any) => l.height)
				defaultQuality =
					levels[(hls as any).currentLevel]?.height ??
					qualityOptions[qualityOptions.length - 1]
			}

			const controls: any[] = [
				'play',
				'progress',
				'current-time',
				'mute',
				'volume',
				'settings',
			]

			const config: Record<string, unknown> = {
				controls,
				speed: {
					selected: snap.playbackRate ?? 1,
					options: [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4],
				},
			}

			if (hls && (hls as any).levels?.length) {
				config.quality = {
					default: defaultQuality,
					options: qualityOptions,
					forced: true,
					onChange: (newQuality: number) => {
						if (!hls) return
						if (newQuality === 0) {
							;(hls as any).currentLevel = -1
						} else {
							const levelIndex = (hls as any).levels.findIndex(
								(l: any) => l.height === newQuality,
							)
							if (levelIndex !== -1) {
								;(hls as any).currentLevel = levelIndex
							}
						}
					},
				}
				config.settings = ['quality', 'speed']
			} else {
				config.settings = ['speed']
			}

			playerRef.current = new Plyr(video, config as any)

			playerRef.current.on('ready', () => {
				const p = playerRef.current
				if (!p || destroyed) return
				p.volume = readSavedVolume()
				p.muted = snap.muted
				if (typeof snap.playbackRate === 'number') {
					p.speed = snap.playbackRate
				}
				p.currentTime = snap.startTime
				setNeedsTapPlay(false)
				if (snap.startPaused) {
					p.pause()
				} else {
					void p.play().catch(() => setNeedsTapPlay(true))
				}
			})

			playerRef.current.on('volumechange', () => {
				const p = playerRef.current
				if (p) {
					localStorage.setItem('video_volume', String(p.volume))
				}
			})

			playerRef.current.on('ended', () => {
				clear()
			})
		}

		void loadPlyr()

		return () => {
			destroyed = true
			setTimeout(() => {
				if (playerRef.current) {
					playerRef.current.destroy()
					playerRef.current = null
				}
			}, 0)
		}
	}, [mediaReady, active?.videoId, active?.startPaused, clear])

	if (!active || !authReady || !premium) return null

	return (
		<div
			className='premium-mini-player fixed z-[55] w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/[0.06] bg-neutral-950/95 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.08] backdrop-blur-xl flex flex-col'
			style={{ bottom: '5.5rem', right: '1.25rem' }}
			role='region'
			aria-label={t('ariaLabel')}
		>
			<div className='flex items-center gap-2 border-b border-white/[0.07] bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-900 px-3 py-2'>
				<p className='flex-1 min-w-0 text-[13px] font-semibold leading-snug tracking-tight text-white/95 truncate'>
					{active.title}
				</p>
				<Button
					type='button'
					variant='ghost'
					size='icon'
					className='size-8 shrink-0 rounded-lg text-white/90 hover:bg-white/12 hover:text-white'
					asChild
				>
					<Link
						href={PAGES.WATCH(active.videoId)}
						title={t('openWatch')}
						onClick={() => clear()}
					>
						<LuMaximize2 className='size-4' />
					</Link>
				</Button>
				<Button
					type='button'
					variant='ghost'
					size='icon'
					className='size-8 shrink-0 rounded-lg text-white/90 hover:bg-white/12 hover:text-white'
					onClick={() => clear()}
					title={t('close')}
				>
					<FiX className='size-[18px]' />
				</Button>
			</div>

			<div className='relative aspect-video bg-black'>
				<video
					key={active.videoId}
					ref={videoRef}
					className='h-full w-full object-contain'
					playsInline
				/>
				{needsTapPlay && (
					<button
						type='button'
						className='absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-semibold text-white backdrop-blur-[2px] transition-colors hover:bg-black/50'
						onClick={() => {
							const p = playerRef.current
							if (p) void p.play().catch(() => {})
							else void videoRef.current?.play().catch(() => {})
							setNeedsTapPlay(false)
						}}
					>
						{t('tapToPlay')}
					</button>
				)}
			</div>
		</div>
	)
}
