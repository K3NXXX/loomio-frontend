'use client'

import { formatCompactCount } from '@/utils/format-compact-count'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback } from 'react'

export function useFormatCompactCount() {
	const locale = useLocale()
	return useCallback(
		(n: number) => formatCompactCount(n, locale),
		[locale],
	)
}

export function useViewsCountLabel() {
	const locale = useLocale()
	const t = useTranslations('videoItem')
	return useCallback(
		(count: number) => {
			const c = Math.trunc(Number.isFinite(count) ? count : 0)
			return t('viewsCountDisplay', {
				count: c,
				formatted: formatCompactCount(c, locale),
			})
		},
		[locale, t],
	)
}
