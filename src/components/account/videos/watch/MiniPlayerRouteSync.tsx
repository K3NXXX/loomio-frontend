'use client'

import { useMiniPlayerStore } from '@/zustand/store/miniPlayerStore'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

function normalizePath(p: string) {
	if (!p || p === '/') return '/'
	return p.replace(/\/+$/, '')
}

/** `/watch` та префікси на кшталт `/uk/watch` */
function isWatchPath(path: string) {
	const n = normalizePath(path)
	return n === '/watch' || /\/watch$/.test(n)
}

function readWatchVideoId(): string | null {
	if (typeof window === 'undefined') return null
	const path = normalizePath(window.location.pathname)
	if (!isWatchPath(path)) return null
	const v = new URLSearchParams(window.location.search).get('v')
	return v && v.length > 0 ? v : null
}

/** При вході на /watch за тим самим відео, що в міні-плеєрі — закрити міні-плеєр */
export function MiniPlayerRouteSync() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const searchKey = searchParams.toString()

	useEffect(() => {
		const watchVideoId = readWatchVideoId()
		const activeId = useMiniPlayerStore.getState().active?.videoId
		if (watchVideoId && activeId === watchVideoId) {
			useMiniPlayerStore.getState().clear()
		}
	}, [pathname, searchKey])

	return null
}
