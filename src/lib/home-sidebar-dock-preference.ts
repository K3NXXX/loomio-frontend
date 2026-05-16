export const HOME_SIDEBAR_DOCK_COOKIE_KEY = 'loomio_home_sidebar_dock'

export const HOME_SIDEBAR_DOCK_SIDES = ['left', 'right'] as const

export type HomeSidebarDockSide = (typeof HOME_SIDEBAR_DOCK_SIDES)[number]

export const DEFAULT_HOME_SIDEBAR_DOCK_SIDE: HomeSidebarDockSide = 'left'

export function parseHomeSidebarDockCookie(
	raw: string | undefined,
): HomeSidebarDockSide {
	const v = raw?.trim().toLowerCase()
	if (v === 'left' || v === 'right') return v
	return DEFAULT_HOME_SIDEBAR_DOCK_SIDE
}
