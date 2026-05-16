import { THEME_COLORS } from '@/types/colors.types'

/** Premium rows — `colorCss` ≈ primary for legacy / solid fallback when preview unavailable. */
export const UIConfiguratorPremiumColors: {
	id: number
	color: THEME_COLORS
	colorCss: string
}[] = [
	{ id: 101, color: THEME_COLORS.PREMIUM, colorCss: '#e86238' },
	{ id: 102, color: THEME_COLORS.PREMIUM_ORCHID, colorCss: '#d9468f' },
	{ id: 103, color: THEME_COLORS.PREMIUM_DENIM, colorCss: '#5b8fc9' },
	{ id: 104, color: THEME_COLORS.PREMIUM_BLUSH, colorCss: '#c21884' },
	{ id: 105, color: THEME_COLORS.PREMIUM_CLAY, colorCss: '#b54a3c' },
	{ id: 106, color: THEME_COLORS.PREMIUM_GRAPHITE, colorCss: '#3d4f72' },
	{ id: 107, color: THEME_COLORS.PREMIUM_HONEY, colorCss: '#e05470' },
	{ id: 108, color: THEME_COLORS.PREMIUM_IRIS, colorCss: '#735ae8' },
	{ id: 109, color: THEME_COLORS.PREMIUM_CITRINE, colorCss: '#dce835' },
	{ id: 110, color: THEME_COLORS.PREMIUM_LAGOON, colorCss: '#38bec9' },
	{ id: 111, color: THEME_COLORS.PREMIUM_LILAC, colorCss: '#a78bfa' },
	{ id: 112, color: THEME_COLORS.PREMIUM_SPRING, colorCss: '#4ade80' },
]
