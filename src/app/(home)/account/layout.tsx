import { requireAuthCookie } from '@/lib/server-auth'

export default async function AccountLayout({
	children,
}: {
	children: React.ReactNode
}) {
	await requireAuthCookie()
	return children
}
