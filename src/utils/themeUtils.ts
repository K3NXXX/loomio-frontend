export const setCSSThemeColor = (color: string) => {
	const root = document.documentElement

	root.style.setProperty('--primary', color)
	root.style.setProperty('--ring', color)
	root.style.setProperty('--sidebar-primary', color)
	root.style.setProperty('--sidebar-ring', color)
}