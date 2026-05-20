'use client'

import { Button } from '@/components/ui/button'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useMiniPlayerStore } from '@/zustand/store/miniPlayerStore'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import 'plyr/dist/plyr.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GripVertical } from 'lucide-react'
import { FiX } from 'react-icons/fi'
import { LuMaximize2 } from 'react-icons/lu'

const MINI_PLAYER_POS_KEY = 'loomio_premium_mini_player_pos'
const RESERVED_BOTTOM_PX = 88
const RESERVED_RIGHT_PX = 20
const VIEW_MARGIN_PX = 8

function readSavedVolume(): number {
	try {
		return parseFloat(localStorage.getItem('video_volume') || '1') || 1
	} catch {
		return 1
	}
}

function readSavedMiniPlayerPosition(): { left: number; top: number } | null {
	if (typeof window === 'undefined') return null
	try {
		const raw = localStorage.getItem(MINI_PLAYER_POS_KEY)
		if (!raw) return null
		const p = JSON.parse(raw) as { left?: unknown; top?: unknown }
		if (typeof p.left !== 'number' || typeof p.top !== 'number') return null
		if (!Number.isFinite(p.left) || !Number.isFinite(p.top)) return null
		return { left: p.left, top: p.top }
	} catch {
		return null
	}
}

function clampMiniPlayerPosition(
	left: number,
	top: number,
	width: number,
	height: number,
) {
	const vw = window.innerWidth
	const vh = window.innerHeight
	const maxL = Math.max(VIEW_MARGIN_PX, vw - width - VIEW_MARGIN_PX)
	const maxT = Math.max(VIEW_MARGIN_PX, vh - height - VIEW_MARGIN_PX)
	return {
		left: Math.min(Math.max(VIEW_MARGIN_PX, left), maxL),
		top: Math.min(Math.max(VIEW_MARGIN_PX, top), maxT),
	}
}

function persistMiniPlayerPosition(left: number, top: number) {
	try {
		localStorage.setItem(
			MINI_PLAYER_POS_KEY,
			JSON.stringify({ left, top }),
		)
	} catch {
		// ignore quota / private mode
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
	const rootRef = useRef<HTMLDivElement>(null)
	const [position, setPosition] = useState<{ left: number; top: number } | null>(
		null,
	)
	const dragRef = useRef<{
		pointerId: number
		startX: number
		startY: number
		origLeft: number
		origTop: number
	} | null>(null)

	useLayoutEffect(() => {
		if (!active) return
		const el = rootRef.current
		if (!el) return
		const w = el.offsetWidth
		const h = el.offsetHeight
		if (w < 1 || h < 1) return

		setPosition((prev) => {
			const base =
				prev ??
				readSavedMiniPlayerPosition() ??
				{
					left: window.innerWidth - w - RESERVED_RIGHT_PX,
					top: window.innerHeight - h - RESERVED_BOTTOM_PX,
				}
			return clampMiniPlayerPosition(base.left, base.top, w, h)
		})
	}, [active?.videoId])

	useEffect(() => {
		if (!active || !position) return

		function onResize() {
			const el = rootRef.current
			if (!el) return
			const w = el.offsetWidth
			const h = el.offsetHeight
			if (w < 1 || h < 1) return
			setPosition((p) =>
				p ? clampMiniPlayerPosition(p.left, p.top, w, h) : p,
			)
		}

		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [active, position])

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

	const handleDragPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
		if (e.button !== 0 || position == null) return
		e.preventDefault()
		e.stopPropagation()
		dragRef.current = {
			pointerId: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			origLeft: position.left,
			origTop: position.top,
		}
		e.currentTarget.setPointerCapture(e.pointerId)
	}

	const handleDragPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
		const d = dragRef.current
		if (!d || e.pointerId !== d.pointerId) return
		const el = rootRef.current
		if (!el) return
		const w = el.offsetWidth
		const h = el.offsetHeight
		const dx = e.clientX - d.startX
		const dy = e.clientY - d.startY
		setPosition(
			clampMiniPlayerPosition(d.origLeft + dx, d.origTop + dy, w, h),
		)
	}

	const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
		const d = dragRef.current
		if (!d || e.pointerId !== d.pointerId) return
		dragRef.current = null
		try {
			e.currentTarget.releasePointerCapture(e.pointerId)
		} catch {
			// already released
		}
		const el = rootRef.current
		if (!el) return
		setPosition((p) => {
			if (!p) return p
			const next = clampMiniPlayerPosition(
				p.left,
				p.top,
				el.offsetWidth,
				el.offsetHeight,
			)
			persistMiniPlayerPosition(next.left, next.top)
			return next
		})
	}

	if (!active || !authReady || !premium) return null

	return (
		<div
			ref={rootRef}
			className='premium-mini-player fixed z-[55] w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/[0.06] bg-neutral-950/95 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.08] backdrop-blur-xl flex flex-col'
			style={
				position
					? { left: position.left, top: position.top }
					: { bottom: '5.5rem', right: '1.25rem' }
			}
			role='region'
			aria-label={t('ariaLabel')}
		>
			<div className='flex items-center gap-1.5 border-b border-white/[0.07] bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-900 px-2 py-2 sm:gap-2 sm:px-3'>
				<Button
					type='button'
					variant='ghost'
					size='icon'
					className='size-8 shrink-0 cursor-grab touch-none select-none rounded-lg text-white/70 hover:bg-white/12 hover:text-white active:cursor-grabbing'
					aria-label={t('dragHandle')}
					title={t('dragHandle')}
					onPointerDown={handleDragPointerDown}
					onPointerMove={handleDragPointerMove}
					onPointerUp={endDrag}
					onPointerCancel={endDrag}
				>
					<GripVertical className='size-4' aria-hidden />
				</Button>
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
