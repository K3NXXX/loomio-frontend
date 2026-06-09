import { PAGES } from '@/constants/pages.constants'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function requireAuthCookie(): Promise<void> {
	const cookieStore = await cookies()
	const token = cookieStore.get('accessToken')?.value
	if (!token) redirect(PAGES.LOGIN)
}
