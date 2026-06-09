'use client'

import { useAddView } from '@/hooks/view/useAddView'
import { cn } from '@/lib/utils'
import { watchMiniSnapshotRef } from '@/lib/watch-mini-player-snapshot'
import type { IVideoChapter } from '@/types/video.types'
import { formatSecondsAsChapterTimecode } from '@/utils/chapterTimecode'
import { useTranslations } from 'next-intl'
import 'plyr/dist/plyr.css'
import {
	type MutableRefObject,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { normalizeChapters } from './WatchChaptersTray'

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
	chapters?: IVideoChapter[] | null
	playerControlRef?: MutableRefObject<{ seek?: (t: number) => void } | null>
	onPlaybackUpdate?: (state: { currentTime: number; duration: number }) => void
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
	chapters,
	playerControlRef,
	onPlaybackUpdate,
}: IWatchVideoProps) {
	const isHls = videoSrc.includes('.m3u8')
	const t = useTranslations()
	const videoRef = useRef<HTMLVideoElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const plyrWrapperRef = useRef<HTMLDivElement>(null)
	const chaptersPropRef = useRef(chapters)
	chaptersPropRef.current = chapters
	const [aspectRatio, setAspectRatio] = useState<number | null>(null)
	const [isReady, setIsReady] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	const [hasFirstFrame, setHasFirstFrame] = useState(false)
	const hasFirstFrameRef = useRef(false)
	const [isPlyrReady, setIsPlyrReady] = useState(false)
	const [isPlyrMenuOpen, setIsPlyrMenuOpen] = useState(false)
	const [mediaDuration, setMediaDuration] = useState(0)
	const [chapterTimelineHint, setChapterTimelineHint] = useState<{
		x: number
		y: number
		title: string
		atTimeLabel: string
	} | null>(null)
	const [chapterScrubPreviewUrl, setChapterScrubPreviewUrl] = useState<
		string | null
	>(null)
	const chapterHintFrameRef = useRef<number | null>(null)
	const scrubPreviewVideoRef = useRef<HTMLVideoElement | null>(null)
	const scrubPreviewHlsRef = useRef<{ destroy: () => void } | null>(null)
	const scrubPreviewDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	)
	const scrubPreviewGenRef = useRef(0)
	const lastScrubPreviewBucketRef = useRef<number | null>(null)
	const timelineHoverLeaveTimerRef = useRef<ReturnType<
		typeof setTimeout
	> | null>(null)
	const onNextRef = useRef(onNext)
	onNextRef.current = onNext
	const endedHandledRef = useRef(false)
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

	useLayoutEffect(() => {
		endedHandledRef.current = false
		setIsReady(false)
		setIsLoading(true)
		setHasFirstFrame(false)
		hasFirstFrameRef.current = false
		setIsPlyrReady(false)
		setMediaDuration(0)
		setChapterTimelineHint(null)
		setChapterScrubPreviewUrl(null)
		hasSentView.current = false

		const p = playerRef.current
		if (p) {
			try {
				p.destroy()
			} catch {}
			playerRef.current = null
		}

		const h = hlsRef.current
		if (h) {
			try {
				h.destroy()
			} catch {}
			hlsRef.current = null
		}

		const scrubH = scrubPreviewHlsRef.current
		if (scrubH) {
			try {
				scrubH.destroy()
			} catch {}
			scrubPreviewHlsRef.current = null
		}
	}, [videoId, videoSrc])

	useEffect(() => {
		if (!canUseBoostSpeed || !videoTitle) return

		function tick() {
			const el = videoRef.current
			if (!el) return
			const title = videoTitle!
			lastKnownPlayingRef.current = !el.paused
			watchMiniSnapshotRef.current = {
				videoId,
				videoSrc,
				title,
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
		const el = videoRef.current
		if (!el || isHls) return

		function handleMetadata() {
			if (el.videoWidth > 0 && el.videoHeight > 0) {
				setAspectRatio(el.videoWidth / el.videoHeight)
			}
			setIsReady(true)
		}

		el.load()
		if (el.readyState >= 1) {
			handleMetadata()
		} else {
			el.addEventListener('loadedmetadata', handleMetadata, { once: true })
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

		let cancelled = false
		let fallbackTimer: ReturnType<typeof setTimeout> | null = null
		let metaHandler: (() => void) | null = null
		let boundVideo: HTMLVideoElement | null = null

		void (async () => {
			const Hls = (await import('hls.js')).default
			const video = videoRef.current
			if (!video || cancelled) return

			boundVideo = video

			let readyEmitted = false
			const clearGuards = () => {
				if (fallbackTimer != null) {
					clearTimeout(fallbackTimer)
					fallbackTimer = null
				}
				if (metaHandler) {
					video.removeEventListener('loadedmetadata', metaHandler)
					metaHandler = null
				}
			}

			const emitReady = () => {
				if (cancelled || readyEmitted) return
				readyEmitted = true
				clearGuards()
				setIsReady(true)
			}

			metaHandler = () => emitReady()
			video.addEventListener('loadedmetadata', metaHandler, { once: true })

			if (Hls.isSupported()) {
				const hls = new Hls({ startLevel: -1 })
				hlsRef.current = hls
				hls.loadSource(videoSrc)
				hls.attachMedia(video)

				hls.on(Hls.Events.MANIFEST_PARSED, () => {
					if (!cancelled) emitReady()
				})

				hls.on(Hls.Events.ERROR, (_e, data: { fatal?: boolean }) => {
					if (cancelled || !data?.fatal) return
					emitReady()
				})

				fallbackTimer = setTimeout(() => emitReady(), 6500)

				if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
					queueMicrotask(emitReady)
				}
			} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
				video.src = videoSrc
				fallbackTimer = setTimeout(() => emitReady(), 6500)
				if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
					queueMicrotask(emitReady)
				}
			} else {
				clearGuards()
			}
		})()

		return () => {
			cancelled = true
			if (fallbackTimer != null) {
				clearTimeout(fallbackTimer)
				fallbackTimer = null
			}
			if (metaHandler && boundVideo) {
				boundVideo.removeEventListener('loadedmetadata', metaHandler)
				metaHandler = null
			}
			boundVideo = null
			const hi = hlsRef.current
			if (hi) {
				try {
					hi.detachMedia()
					hi.destroy()
				} catch {}
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
				tooltips: {
					seek: false,
				},
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
				if (endedHandledRef.current) return
				endedHandledRef.current = true
				removeSavedTime(videoId)
				const goNext = onNextRef.current
				if (!goNext) return
				window.setTimeout(() => goNext(), 400)
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
				} catch {}
			}
			if (playerRef.current === p) {
				playerRef.current = null
			}
		}
	}, [isReady, isHls, videoId, videoSrc])

	useEffect(() => {
		const v = videoRef.current
		if (!v) return
		const upd = () => {
			const d = v.duration
			if (Number.isFinite(d) && d > 0) setMediaDuration(d)
		}
		upd()
		v.addEventListener('loadedmetadata', upd)
		v.addEventListener('durationchange', upd)
		return () => {
			v.removeEventListener('loadedmetadata', upd)
			v.removeEventListener('durationchange', upd)
		}
	}, [videoSrc, isReady])

	useEffect(() => {
		if (!playerControlRef) return
		if (!isPlyrReady) {
			playerControlRef.current = null
			return
		}
		playerControlRef.current = {
			seek: (t: number) => {
				const p = playerRef.current
				if (p && Number.isFinite(t)) p.currentTime = Math.max(0, t)
			},
		}
		return () => {
			playerControlRef.current = null
		}
	}, [isPlyrReady, playerControlRef])

	useEffect(() => {
		const v = videoRef.current
		if (!v || !onPlaybackUpdate) return
		const emit = () => {
			const d = v.duration
			onPlaybackUpdate({
				currentTime: v.currentTime,
				duration: Number.isFinite(d) ? d : 0,
			})
		}
		emit()
		v.addEventListener('timeupdate', emit)
		v.addEventListener('durationchange', emit)
		v.addEventListener('loadedmetadata', emit)
		return () => {
			v.removeEventListener('timeupdate', emit)
			v.removeEventListener('durationchange', emit)
			v.removeEventListener('loadedmetadata', emit)
		}
	}, [onPlaybackUpdate, videoId, videoSrc])

	useEffect(() => {
		if (
			!isPlyrReady ||
			!plyrWrapperRef.current ||
			!chapters?.length ||
			mediaDuration <= 0
		) {
			return
		}
		const wrap = plyrWrapperRef.current
		const progressBar = wrap.querySelector(
			'.plyr__progress',
		) as HTMLElement | null
		const video = videoRef.current
		if (!progressBar || !video) return

		const sorted = normalizeChapters(chapters)
		if (sorted.length === 0) return

		const duration = mediaDuration
		progressBar
			.querySelectorAll('.loomio-chapter-layer')
			.forEach((el) => el.remove())

		progressBar.style.position = 'relative'

		const starts = sorted
			.map((c) => c.startSeconds)
			.filter((s) => s > 0 && s < duration)
		const boundarySet = new Set<number>([0, ...starts, duration])
		const b = [...boundarySet]
			.filter((x) => x >= 0 && x <= duration)
			.sort((a, c) => a - c)

		const layer = document.createElement('div')
		layer.className = 'loomio-chapter-layer'

		const segments: { start: number; end: number; fill: HTMLDivElement }[] = []

		for (let i = 0; i < b.length - 1; i++) {
			const start = b[i]
			const end = b[i + 1]
			const len = end - start
			if (len <= 0) continue

			const seg = document.createElement('div')
			seg.className = 'loomio-chapter-seg-track'
			seg.style.flex = `${len} 1 0`

			const fill = document.createElement('div')
			fill.className = 'loomio-chapter-seg-fill'

			seg.appendChild(fill)
			layer.appendChild(seg)
			segments.push({ start, end, fill })
		}

		const updateFills = () => {
			const t = video.currentTime
			for (const s of segments) {
				const segDur = s.end - s.start
				if (segDur <= 0) {
					s.fill.style.width = '0%'
					continue
				}
				const played = Math.max(0, Math.min(segDur, t - s.start))
				s.fill.style.width = `${(played / segDur) * 100}%`
			}
		}

		progressBar.insertBefore(layer, progressBar.firstChild)
		updateFills()
		video.addEventListener('timeupdate', updateFills)
		video.addEventListener('seeked', updateFills)

		return () => {
			video.removeEventListener('timeupdate', updateFills)
			video.removeEventListener('seeked', updateFills)
			layer.remove()
		}
	}, [isPlyrReady, chapters, mediaDuration, videoId])

	useEffect(() => {
		return () => {
			const h = scrubPreviewHlsRef.current
			if (h) {
				try {
					h.destroy()
				} catch {}
				scrubPreviewHlsRef.current = null
			}
		}
	}, [videoSrc])

	useEffect(() => {
		if (!isPlyrReady || mediaDuration <= 0 || !plyrWrapperRef.current) {
			setChapterTimelineHint(null)
			setChapterScrubPreviewUrl(null)
			if (scrubPreviewDebounceRef.current) {
				clearTimeout(scrubPreviewDebounceRef.current)
				scrubPreviewDebounceRef.current = null
			}
			scrubPreviewGenRef.current++
			return
		}
		const wrap = plyrWrapperRef.current
		const container = wrap.querySelector(
			'.plyr__progress__container',
		) as HTMLElement | null
		if (!container) return

		const duration = mediaDuration
		let lastX = 0

		const ensureScrubPreviewHls = async () => {
			const pv = scrubPreviewVideoRef.current
			if (!pv || !isHls || scrubPreviewHlsRef.current) return Boolean(pv)

			const HlsMod = (await import('hls.js')).default
			if (!scrubPreviewVideoRef.current) return false

			if (HlsMod.isSupported()) {
				const hls = new HlsMod({
					startLevel: -1,
					maxBufferLength: 6,
					maxMaxBufferLength: 12,
				})
				hls.loadSource(videoSrc)
				hls.attachMedia(scrubPreviewVideoRef.current)
				scrubPreviewHlsRef.current = hls
				return true
			}
			if (
				scrubPreviewVideoRef.current.canPlayType(
					'application/vnd.apple.mpegurl',
				)
			) {
				scrubPreviewVideoRef.current.src = videoSrc
				return true
			}
			return false
		}

		const scheduleScrubPreview = (tPos: number) => {
			const bucket = Math.floor(tPos)
			if (lastScrubPreviewBucketRef.current === bucket) return
			lastScrubPreviewBucketRef.current = bucket

			if (scrubPreviewDebounceRef.current) {
				clearTimeout(scrubPreviewDebounceRef.current)
				scrubPreviewDebounceRef.current = null
			}
			scrubPreviewDebounceRef.current = setTimeout(() => {
				scrubPreviewDebounceRef.current = null
				const gen = ++scrubPreviewGenRef.current
				const pv = scrubPreviewVideoRef.current
				if (!pv) return

				const captureFrame = () => {
					if (gen !== scrubPreviewGenRef.current) return
					if (pv.readyState < 2) {
						pv.addEventListener('loadeddata', captureFrame, { once: true })
						return
					}
					const dur =
						Number.isFinite(pv.duration) && pv.duration > 0
							? pv.duration
							: duration
					const targ = Math.max(0, Math.min(tPos, dur - 0.05))
					let finished = false
					const snap = () => {
						if (finished || gen !== scrubPreviewGenRef.current) return
						finished = true
						try {
							const w = pv.videoWidth
							const h = pv.videoHeight
							if (!w || !h) return
							const canvas = document.createElement('canvas')
							const maxW = 320
							const scale = Math.min(1, maxW / w)
							canvas.width = Math.round(w * scale)
							canvas.height = Math.round(h * scale)
							const ctx = canvas.getContext('2d')
							if (!ctx) return
							ctx.drawImage(pv, 0, 0, canvas.width, canvas.height)
							setChapterScrubPreviewUrl(canvas.toDataURL('image/jpeg', 0.85))
						} catch {
							return
						}
					}
					pv.addEventListener('seeked', snap, { once: true })
					pv.currentTime = targ
					requestAnimationFrame(() => {
						if (gen !== scrubPreviewGenRef.current || finished) return
						if (Math.abs(pv.currentTime - targ) < 0.06) snap()
					})
				}

				void (async () => {
					if (isHls) {
						const ok = await ensureScrubPreviewHls()
						if (!ok || gen !== scrubPreviewGenRef.current) return
					}
					captureFrame()
				})()
			}, 90)
		}

		const publishHint = () => {
			chapterHintFrameRef.current = null
			const sorted = normalizeChapters(chaptersPropRef.current ?? null)
			const rect = container.getBoundingClientRect()
			const ratio = Math.max(0, Math.min(1, (lastX - rect.left) / rect.width))
			const tPos = ratio * duration
			let title = ''
			for (let i = sorted.length - 1; i >= 0; i--) {
				if (sorted[i].startSeconds <= tPos + 0.02) {
					title = sorted[i].title
					break
				}
			}
			const atTimeLabel = formatSecondsAsChapterTimecode(tPos)
			setChapterTimelineHint({
				x: lastX,
				y: rect.top,
				title,
				atTimeLabel,
			})
			scheduleScrubPreview(tPos)
		}

		const clearTimelineHover = () => {
			if (chapterHintFrameRef.current != null) {
				cancelAnimationFrame(chapterHintFrameRef.current)
				chapterHintFrameRef.current = null
			}
			if (scrubPreviewDebounceRef.current) {
				clearTimeout(scrubPreviewDebounceRef.current)
				scrubPreviewDebounceRef.current = null
			}
			lastScrubPreviewBucketRef.current = null
			scrubPreviewGenRef.current++
			setChapterTimelineHint(null)
			setChapterScrubPreviewUrl(null)
			const h = scrubPreviewHlsRef.current
			if (h) {
				try {
					h.destroy()
				} catch {}
				scrubPreviewHlsRef.current = null
			}
		}

		const onMove = (e: MouseEvent) => {
			if (timelineHoverLeaveTimerRef.current) {
				clearTimeout(timelineHoverLeaveTimerRef.current)
				timelineHoverLeaveTimerRef.current = null
			}
			lastX = e.clientX
			if (chapterHintFrameRef.current != null) return
			chapterHintFrameRef.current = requestAnimationFrame(publishHint)
		}

		const onLeave = () => {
			if (timelineHoverLeaveTimerRef.current) {
				clearTimeout(timelineHoverLeaveTimerRef.current)
			}
			timelineHoverLeaveTimerRef.current = setTimeout(() => {
				timelineHoverLeaveTimerRef.current = null
				clearTimelineHover()
			}, 120)
		}

		container.addEventListener('mousemove', onMove)
		container.addEventListener('mouseleave', onLeave)
		return () => {
			container.removeEventListener('mousemove', onMove)
			container.removeEventListener('mouseleave', onLeave)
			if (timelineHoverLeaveTimerRef.current) {
				clearTimeout(timelineHoverLeaveTimerRef.current)
				timelineHoverLeaveTimerRef.current = null
			}
			clearTimelineHover()
		}
	}, [isPlyrReady, mediaDuration, videoId, isHls, videoSrc])

	useEffect(() => {
		const wrapMaybe = plyrWrapperRef.current
		if (!wrapMaybe || !isPlyrReady) return
		const wrap = wrapMaybe

		const lockedHint = t('watchVideo.premiumSpeedTooltip')

		function applyPremiumVisualLock() {
			const panel = wrap.querySelector('[id^="plyr-settings-"][id$="-speed"]')
			if (!panel) return

			panel.querySelectorAll('button[role="menuitemradio"]').forEach((node) => {
				const btn = node as HTMLButtonElement
				const val = Number.parseFloat(String(btn.value ?? ''))
				const isBoost = Number.isFinite(val) && val >= PREMIUM_SPEED_THRESHOLD
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

	const showInitialLoader = !isPlyrReady || (isLoading && !hasFirstFrame)
	const hasChapterMarkers = normalizeChapters(chapters ?? null).length > 0

	return (
		<div
			ref={containerRef}
			className={cn(
				'watch-video-root relative w-full max-w-full overflow-hidden rounded-xl bg-black',
				hasChapterMarkers && 'watch-video-root--chapters',
			)}
			style={
				aspectRatio
					? { aspectRatio: `${aspectRatio}` }
					: { aspectRatio: '16/9' }
			}
			role='presentation'
		>
			{chapterTimelineHint && (
				<div
					className='pointer-events-none fixed z-[200]'
					style={{
						left: chapterTimelineHint.x,
						top: chapterTimelineHint.y - 14,
						transform: 'translate(-50%, -100%)',
					}}
					role='status'
				>
					<div className='flex w-[min(264px,46vw)] max-w-[78vw] flex-col items-stretch gap-2.5'>
						<div className='relative shrink-0 overflow-hidden rounded-xl bg-neutral-950 shadow-[0_12px_42px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.88]'>
							{chapterScrubPreviewUrl ? (
								// eslint-disable-next-line @next/next/no-img-element -- JPEG data URL from canvas
								<img
									key={chapterScrubPreviewUrl.slice(0, 48)}
									src={chapterScrubPreviewUrl}
									alt=''
									className='aspect-video h-auto w-full object-cover'
									draggable={false}
								/>
							) : (
								<div className='aspect-video w-full bg-gradient-to-b from-neutral-800 to-neutral-950' />
							)}
							<div
								className='pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-black/55 via-black/15 to-transparent'
								aria-hidden
							/>
						</div>
						<div className='relative rounded-2xl border border-white/[0.14] bg-neutral-950/[0.82] px-3.5 py-2.5 shadow-[0_6px_22px_rgba(0,0,0,0.5)] backdrop-blur-md supports-[backdrop-filter]:bg-neutral-950/70'>
							<div className='flex min-w-0 items-center gap-2.5'>
								<span className='shrink-0 rounded-md bg-white/[0.12] px-2 py-0.5 text-center text-[12px] font-semibold tabular-nums tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'>
									{chapterTimelineHint.atTimeLabel}
								</span>
								{chapterTimelineHint.title ? (
									<span className='min-w-0 truncate text-[13px] font-medium leading-snug text-white/[0.96]'>
										{chapterTimelineHint.title}
									</span>
								) : null}
							</div>
							<div
								className='absolute left-1/2 top-full -translate-x-1/2 border-x-[7px] border-x-transparent border-t-[7px] border-t-[rgba(23,23,23,0.92)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]'
								aria-hidden
							/>
						</div>
					</div>
				</div>
			)}
			{showInitialLoader && (
				<div className='absolute inset-0 z-10 flex items-center justify-center bg-black pointer-events-none'>
					<div className='w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin' />
				</div>
			)}

			<video
				ref={scrubPreviewVideoRef}
				src={isHls ? undefined : videoSrc}
				muted
				playsInline
				preload='auto'
				tabIndex={-1}
				className='pointer-events-none fixed left-0 top-0 h-px w-px opacity-0'
				aria-hidden
			/>

			<div ref={plyrWrapperRef} className='w-full h-full relative'>
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

				<div key={videoId} className='w-full h-full'>
					<video
						ref={videoRef}
						src={isHls ? undefined : videoSrc}
						className='w-full h-full object-contain'
						onCanPlay={() => {
							setIsLoading(false)
							hasFirstFrameRef.current = true
							setHasFirstFrame(true)
						}}
						onWaiting={() => {
							if (!hasFirstFrameRef.current) setIsLoading(true)
						}}
						onPlaying={() => {
							setIsLoading(false)
							hasFirstFrameRef.current = true
							setHasFirstFrame(true)
						}}
						autoPlay
						muted
						playsInline
						preload='auto'
					/>
				</div>
			</div>
		</div>
	)
}
