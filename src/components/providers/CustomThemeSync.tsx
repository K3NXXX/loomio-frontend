'use client'

import { useGetMe } from '@/hooks/auth/useGetMe'
import { applyThemeClassOnDocument } from '@/lib/theme-dom'
import { THEME_COLORS } from '@/types/colors.types'
import { useEffect } from 'react'

/** Reconciles API custom palette after client navigation (getMe may arrive after SSR HTML + cookie). */
export function CustomThemeSync() {
	const { userData, authReady } = useGetMe()

	useEffect(() => {
		if (!authReady) return
		const theme = userData?.theme as THEME_COLORS | undefined
		if (
			theme === THEME_COLORS.CUSTOM &&
			userData?.customTheme?.background &&
			userData?.customTheme?.primary
		) {
			applyThemeClassOnDocument(theme, userData.customTheme)
		}
	}, [
		authReady,
		userData?.theme,
		userData?.customTheme?.background,
		userData?.customTheme?.primary,
	])

	return null
}
