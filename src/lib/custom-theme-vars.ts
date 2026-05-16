/** Same name as backend `CookieService.CUSTOM_THEME_COOKIE`. */
export const CUSTOM_THEME_COOKIE_NAME = 'loomio_custom_theme'

export type CustomThemePayload = {
	background: string
	primary: string
}

const HEX = /^#[0-9A-Fa-f]{6}$/

export function isValidHex6(s: string): boolean {
	return HEX.test(s)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
	const h = hex.replace('#', '')
	const n = parseInt(h, 16)
	return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function relativeLuminance(hex: string): number {
	const { r, g, b } = hexToRgb(hex)
	const [rs, gs, bs] = [r, g, b].map((c) => {
		const s = c / 255
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
	})
	return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function mixOklch(fg: string, bg: string, fgPercent: number): string {
	return `color-mix(in oklch, ${fg} ${fgPercent}%, ${bg})`
}

export function foregroundForBackground(bgHex: string): string {
	return relativeLuminance(bgHex) > 0.45
		? 'oklch(0.16 0.02 280)'
		: 'oklch(0.985 0.005 280)'
}

export function foregroundForPrimary(primaryHex: string): string {
	return relativeLuminance(primaryHex) > 0.45
		? 'oklch(0.14 0.02 280)'
		: 'oklch(0.99 0.01 280)'
}

/** Builds CSS variable map for `<html style=…>` (SSR) and client `document.documentElement`. */
export function buildCustomThemeCssVariablesRecord(
	bg: string,
	primary: string,
): Record<string, string> {
	const fg = foregroundForBackground(bg)
	const pfg = foregroundForPrimary(primary)
	const card = mixOklch(fg, bg, 6)
	const popover = card
	const muted = mixOklch(fg, bg, 10)
	const mutedFg = mixOklch(fg, bg, 46)
	const secondary = mixOklch(fg, bg, 12)
	const border = mixOklch(fg, bg, 14)
	const accent = mixOklch(primary, bg, 18)

	return {
		'--background': bg,
		'--foreground': fg,
		'--card': card,
		'--card-foreground': fg,
		'--popover': popover,
		'--popover-foreground': fg,
		'--primary': primary,
		'--primary-foreground': pfg,
		'--secondary': secondary,
		'--secondary-foreground': fg,
		'--muted': muted,
		'--muted-foreground': mutedFg,
		'--accent': accent,
		'--accent-foreground': fg,
		'--destructive': 'oklch(0.577 0.245 27.325)',
		'--border': border,
		'--input': border,
		'--ring': primary,
		'--sidebar': mixOklch(fg, bg, 5),
		'--sidebar-foreground': fg,
		'--sidebar-primary': primary,
		'--sidebar-primary-foreground': pfg,
		'--sidebar-accent': muted,
		'--sidebar-accent-foreground': fg,
		'--sidebar-border': border,
		'--sidebar-ring': primary,
		'--chart-1': primary,
		'--chart-2': mixOklch(primary, bg, 35),
		'--chart-3': mixOklch(primary, bg, 55),
		'--chart-4': accent,
		'--chart-5': mutedFg,
	}
}
