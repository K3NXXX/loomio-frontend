import { NextRequest, NextResponse } from 'next/server'
import { PAGES } from './constants/pages.constants'

export function middleware(req: NextRequest) {
	if (req.nextUrl.pathname === PAGES.PREMIUM_SUCCESS) {
		const sessionId = req.nextUrl.searchParams.get('session_id')
		if (!sessionId) return NextResponse.redirect(new URL('/', req.url))

		const token = req.cookies.get('accessToken')?.value
		if (!token) return NextResponse.redirect(new URL('/', req.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
