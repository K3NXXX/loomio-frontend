export enum THEME_COLORS {
	RED = 'RED',
	ORANGE = 'ORANGE',
	GREEN = 'GREEN',
	BLUE = 'BLUE',
	YELLOW = 'YELLOW',
	VIOLET = 'VIOLET',
	WHITE = 'WHITE',
}

export interface ChangeThemeResponse {
	message: string
	theme: THEME_COLORS
}
