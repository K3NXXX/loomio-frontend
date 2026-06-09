'use client'

import { useMiniPlayerStore } from '@/zustand/store/miniPlayerStore'
import { type ReactNode, useEffect, useRef } from 'react'

function normalizePath(p: string) {
	if (!p || p === '/') return '/'
	return p.replace(/\/+$/, '')
}

function isWatchPath(path: string) {
	const n = normalizePath(path)
	return n === '/watch' || /\/watch$/.test(n)
}

export function WatchMiniPlayerLeaveBridge({
	premium,
	children,
}: {
	premium: boolean
	children: ReactNode
}) {
	const premiumRef = useRef(premium)
	premiumRef.current = premium

	useEffect(() => {
		return () => {
			if (!premiumRef.current) return
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					if (typeof window === 'undefined') return
					if (isWatchPath(window.location.pathname)) return
					useMiniPlayerStore.getState().openFromWatchSnapshot()
				})
			})
		}
	}, [])

	return <>{children}</>
}
