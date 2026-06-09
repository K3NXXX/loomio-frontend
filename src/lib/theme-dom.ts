import { THEME_COLORS } from '@/types/colors.types'

import type { CustomThemePayload } from '@/lib/custom-theme-vars'
import { buildCustomThemeCssVariablesRecord } from '@/lib/custom-theme-vars'

const DUMMY_CUSTOM = buildCustomThemeCssVariablesRecord('#000000', '#ffffff')
export const CUSTOM_THEME_CSS_KEYS = Object.keys(DUMMY_CUSTOM) as string[]

export function applyThemeClassOnDocument(
	theme: THEME_COLORS,
	custom?: CustomThemePayload | null,
): void {
	if (typeof document === 'undefined') return
	const root = document.documentElement
	Array.from(root.classList)
		.filter((cls) => cls.startsWith('theme-'))
		.forEach((cls) => root.classList.remove(cls))
	root.classList.add(`theme-${theme.toLowerCase()}`)

	if (theme === THEME_COLORS.CUSTOM && custom) {
		const vars = buildCustomThemeCssVariablesRecord(custom.background, custom.primary)
		for (const [key, val] of Object.entries(vars)) {
			root.style.setProperty(key, val)
		}
	} else if (theme !== THEME_COLORS.CUSTOM) {
		for (const key of CUSTOM_THEME_CSS_KEYS) {
			root.style.removeProperty(key)
		}
	}
}
