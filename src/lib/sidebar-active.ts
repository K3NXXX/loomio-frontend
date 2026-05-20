import { PAGES } from '@/constants/pages.constants'

export function isSidebarItemActive(pathname: string, url: string): boolean {
	if (url === PAGES.HOME) return pathname === PAGES.HOME
	if (url === PAGES.KIDS) {
		return pathname === PAGES.KIDS || pathname.startsWith(`${PAGES.KIDS}/`)
	}
	return pathname === url || pathname.startsWith(`${url}/`)
}
