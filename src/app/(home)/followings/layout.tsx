import { requireAuthCookie } from '@/lib/server-auth'

export default async function FollowingsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	await requireAuthCookie()
	return children
}
