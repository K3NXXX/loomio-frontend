export type AppearanceCookieValue = 'light' | 'dark'

export function appearanceFromApi(api: string): AppearanceCookieValue {
	return String(api).toUpperCase() === 'LIGHT' ? 'light' : 'dark'
}

export function applyAppearanceToDocument(mode: AppearanceCookieValue): void {
	if (typeof document === 'undefined') return
	const root = document.documentElement
	if (mode === 'dark') {
		root.classList.add('dark')
	} else {
		root.classList.remove('dark')
	}
}
