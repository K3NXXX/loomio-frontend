'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '../../ui/breadcrumb'

export function HeaderBreadcrumbs() {
	const pathname = usePathname()
	const segments = pathname.split('/').filter(Boolean)

	const formatSegment = (segment: string) => {
		return segment
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	}

	const crumbs = segments.map((segment, index) => {
		const href = '/' + segments.slice(0, index + 1).join('/')
		const label = formatSegment(segment)
		return { href, label, isLast: index === segments.length - 1 }
	})

	return (
		<div className='max-w-[99%] w-full px-4 pt-4'>
			<Breadcrumb>
				<BreadcrumbList>
					{crumbs.length === 0 ? (
						<BreadcrumbItem>
							<BreadcrumbPage>Home</BreadcrumbPage>
						</BreadcrumbItem>
					) : (
						<>
							<BreadcrumbItem>
								<BreadcrumbLink className='font-bold' asChild>
									<NextLink href='/'>Home</NextLink>
								</BreadcrumbLink>
							</BreadcrumbItem>

							{crumbs.map(({ href, label, isLast }) => (
								<div key={href} className='flex items-center'>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage className='font-bold pl-2'>
												{label}
											</BreadcrumbPage>
										) : (
											<BreadcrumbLink className='font-bold pl-2' asChild>
												<NextLink href={href}>{label}</NextLink>
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
								</div>
							))}
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	)
}
