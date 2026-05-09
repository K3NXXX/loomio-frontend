import { requireAuthCookie } from '@/lib/server-auth'

export default async function WorkplaceSectionLayout({
	children,
}: {
	children: React.ReactNode
}) {
	await requireAuthCookie()
	return children
}
