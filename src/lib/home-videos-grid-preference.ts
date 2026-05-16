export const HOME_VIDEO_GRID_COOKIE_KEY = 'loomio_home_video_cols'

export const HOME_VIDEO_GRID_COLUMNS = [2, 3, 4, 5] as const

export type HomeVideoGridColumns = (typeof HOME_VIDEO_GRID_COLUMNS)[number]

export const DEFAULT_HOME_VIDEO_GRID_COLUMNS: HomeVideoGridColumns = 3

export function parseHomeVideoGridCookie(
	raw: string | undefined,
): HomeVideoGridColumns {
	const v = raw?.trim()
	if (!v) return DEFAULT_HOME_VIDEO_GRID_COLUMNS
	const n = Number(v)
	return HOME_VIDEO_GRID_COLUMNS.includes(n as HomeVideoGridColumns)
		? (n as HomeVideoGridColumns)
		: DEFAULT_HOME_VIDEO_GRID_COLUMNS
}

export function homeVideosGridClassName(
	cols: HomeVideoGridColumns,
): string {
	const base = 'grid gap-6'
	switch (cols) {
		case 2:
			return `${base} grid-cols-1 sm:grid-cols-2`
		case 3:
			return `${base} grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`
		case 4:
			return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
		case 5:
			return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`
		default:
			return `${base} grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`
	}
}
