import { THEME_COLORS } from '@/types/colors.types'

export type PremiumPreviewStrip = {
	light: readonly [string, string, string]
	dark: readonly [string, string, string]
}

export const PREMIUM_THEME_PREVIEW_OKLCH: Partial<
	Record<THEME_COLORS, PremiumPreviewStrip>
> = {
	[THEME_COLORS.PREMIUM]: {
		light: [
			'oklch(0.6397 0.172 36.4421)',
			'oklch(0.967 0.0029 264.5419)',
			'oklch(0.9119 0.0222 243.8174)',
		],
		dark: [
			'oklch(0.6397 0.172 36.4421)',
			'oklch(0.3095 0.0266 266.7132)',
			'oklch(0.338 0.0589 267.5867)',
		],
	},
	[THEME_COLORS.PREMIUM_ORCHID]: {
		light: [
			'oklch(0.6726 0.2904 341.4084)',
			'oklch(0.9595 0.02 286.0164)',
			'oklch(0.8903 0.1739 171.269)',
		],
		dark: [
			'oklch(0.6726 0.2904 341.4084)',
			'oklch(0.2542 0.0611 281.1423)',
			'oklch(0.8903 0.1739 171.269)',
		],
	},
	[THEME_COLORS.PREMIUM_DENIM]: {
		light: [
			'oklch(0.669 0.046 235.824)',
			'oklch(0.431 0.051 239.139)',
			'oklch(0.284 0.035 231.471)',
		],
		dark: [
			'oklch(0.669 0.046 235.824)',
			'oklch(0.431 0.051 239.139)',
			'oklch(0.929 0.014 219.625)',
		],
	},
	[THEME_COLORS.PREMIUM_BLUSH]: {
		light: [
			'oklch(0.6002 0.2414 343.9344)',
			'oklch(0.923 0.0701 326.1273)',
			'oklch(0.8766 0.0828 344.8849)',
		],
		dark: [
			'oklch(0.7543 0.2319 332.0212)',
			'oklch(0.3184 0.0915 319.6465)',
			'oklch(0.3558 0.1201 325.7655)',
		],
	},
	[THEME_COLORS.PREMIUM_CLAY]: {
		light: [
			'oklch(0.505 0.196 16.577)',
			'oklch(0.375 0.136 19.709)',
			'oklch(0.44 0.145 15.485)',
		],
		dark: [
			'oklch(0.416 0.166 14.083)',
			'oklch(0.426 0.105 4.914)',
			'oklch(0.383 0.153 10.638)',
		],
	},
	[THEME_COLORS.PREMIUM_GRAPHITE]: {
		light: [
			'oklch(0.14 0.017 263.511)',
			'oklch(0.68 0.048 208.577)',
			'oklch(0.961 0.001 0)',
		],
		dark: [
			'oklch(0.985 0.001 0)',
			'oklch(0.68 0.048 208.577)',
			'oklch(0.321 0.001 0)',
		],
	},
	[THEME_COLORS.PREMIUM_HONEY]: {
		light: [
			'oklch(0.5924 0.2025 355.8943)',
			'oklch(0.6437 0.1019 187.384)',
			'oklch(0.5808 0.1732 39.5003)',
		],
		dark: [
			'oklch(0.5924 0.2025 355.8943)',
			'oklch(0.6437 0.1019 187.384)',
			'oklch(0.5808 0.1732 39.5003)',
		],
	},
	[THEME_COLORS.PREMIUM_IRIS]: {
		light: [
			'oklch(0.5417 0.179 288.0332)',
			'oklch(0.9174 0.0435 292.6901)',
			'oklch(0.9221 0.0373 262.141)',
		],
		dark: [
			'oklch(0.7162 0.1597 290.3962)',
			'oklch(0.3139 0.0736 283.4591)',
			'oklch(0.3354 0.0828 280.9705)',
		],
	},
	[THEME_COLORS.PREMIUM_CITRINE]: {
		light: ['oklch(0.205 0 0)', 'oklch(0.97 0 0)', 'oklch(0.922 0 0)'],
		dark: [
			'oklch(0.926 0.195 104.561)',
			'oklch(0.521 0 263.283)',
			'oklch(0.315 0.087 281.076)',
		],
	},
	[THEME_COLORS.PREMIUM_LAGOON]: {
		light: ['oklch(0.205 0 0)', 'oklch(0.97 0 0)', 'oklch(0.922 0 0)'],
		dark: [
			'oklch(0.901 0.154 195.798)',
			'oklch(0.819 0.158 91.654)',
			'oklch(0.789 0.111 188.562)',
		],
	},
	[THEME_COLORS.PREMIUM_LILAC]: {
		light: [
			'oklch(0.252 0.034 283.713)',
			'oklch(0.91 0.05 1.002)',
			'oklch(0.645 0.037 290.824)',
		],
		dark: [
			'oklch(0.901 0.017 221.092)',
			'oklch(0.672 0.03 274.442)',
			'oklch(0.296 0.034 326.391)',
		],
	},
	[THEME_COLORS.PREMIUM_SPRING]: {
		light: [
			'oklch(0.738 0.207 135.282)',
			'oklch(0.504 0.245 297.501)',
			'oklch(0.598 0.176 303.179)',
		],
		dark: [
			'oklch(0.795 0.18 133.519)',
			'oklch(0.504 0.245 297.501)',
			'oklch(0.598 0.176 303.179)',
		],
	},
}

export function premiumPreviewStrip(
	theme: THEME_COLORS,
	isDark: boolean,
): readonly string[] | undefined {
	const strip = PREMIUM_THEME_PREVIEW_OKLCH[theme]
	if (!strip) return undefined
	return isDark ? strip.dark : strip.light
}
