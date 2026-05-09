import { SidebarProvider } from '@/components/ui/sidebar'
import { PAGES } from '@/constants/pages.constants'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ClientHomeLayout } from './ClientHomeLayout'

type JwtPayloadWithRole = {
	role: string

}

export default async function HomeLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const cookieStore = await cookies()
	const token = cookieStore.get('accessToken')?.value

	if (token) {
		try {
			const payload = jwtDecode<JwtPayloadWithRole>(token)
			if (payload.role === 'ADMIN') {
				redirect(PAGES.MODERATION_DASHBOARD)
			}
		} catch {
		}
	}
	return (
		<SidebarProvider>
			<ClientHomeLayout>{children}</ClientHomeLayout>
		</SidebarProvider>
	)
}
