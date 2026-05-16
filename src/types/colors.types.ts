export enum THEME_COLORS {
	RED = 'RED',
	ORANGE = 'ORANGE',
	GREEN = 'GREEN',
	BLUE = 'BLUE',
	YELLOW = 'YELLOW',
	VIOLET = 'VIOLET',
	WHITE = 'WHITE',
	PREMIUM = 'PREMIUM',
	PREMIUM_ORCHID = 'PREMIUM_ORCHID',
	PREMIUM_DENIM = 'PREMIUM_DENIM',
	PREMIUM_BLUSH = 'PREMIUM_BLUSH',
	PREMIUM_CLAY = 'PREMIUM_CLAY',
	PREMIUM_GRAPHITE = 'PREMIUM_GRAPHITE',
	PREMIUM_HONEY = 'PREMIUM_HONEY',
	PREMIUM_IRIS = 'PREMIUM_IRIS',
	PREMIUM_CITRINE = 'PREMIUM_CITRINE',
	PREMIUM_LAGOON = 'PREMIUM_LAGOON',
	PREMIUM_LILAC = 'PREMIUM_LILAC',
	PREMIUM_SPRING = 'PREMIUM_SPRING',
	CUSTOM = 'CUSTOM',
}

export interface ChangeThemeResponse {
	message: string
	theme: THEME_COLORS
}

export interface ChangeCustomThemeResponse {
	message: string
	theme: THEME_COLORS
	customTheme: { background: string; primary: string }
}

export const AppearanceApi = {
	LIGHT: 'LIGHT',
	DARK: 'DARK',
} as const

export type AppearanceApiMode = (typeof AppearanceApi)[keyof typeof AppearanceApi]

export interface ChangeAppearanceResponse {
	message: string
	appearance: AppearanceApiMode
}
