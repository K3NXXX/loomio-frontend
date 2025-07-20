import { usePathname } from 'next/navigation'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '../ui/breadcrumb'

export function DashboardHeader() {
	const pathname = usePathname()
	const segments = pathname.split('/').filter(Boolean)

	const prettyNames: Record<string, string> = {
		dashboard: 'Dashboard',
		projects: 'Projects',
		editor: 'Editor',
		tasks: 'Tasks',
	}

	const formatSegment = (segment: string) =>
		prettyNames[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)

	return (
		<div className='pt-5 flex justify-between max-w-[99%] w-full items-center '>
			<Breadcrumb>
				<BreadcrumbList>
					{segments.map((segment, index) => {
						const href = '/' + segments.slice(0, index + 1).join('/')
						const isLast = index === segments.length - 1

						return (
							<>
								{index > 0 && <BreadcrumbSeparator />}
								<BreadcrumbItem key={href}>
									{isLast ? (
										<BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
									) : (
										<BreadcrumbLink href={href}>
											{formatSegment(segment)}
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</>
						)
					})}
				</BreadcrumbList>
			</Breadcrumb>
			<div>
				<p>Welcome, Volodymyr!</p>
			</div>
		</div>
	)
}
