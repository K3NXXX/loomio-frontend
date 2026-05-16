'use client'

import * as React from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'

function Avatar({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
	return (
		<AvatarPrimitive.Root
			data-slot='avatar'
			className={cn(
				'relative flex size-8 shrink-0 overflow-hidden rounded-full',
				className,
			)}
			{...props}
		/>
	)
}

function AvatarImage({
	className,
	src,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
	/** Must always mount `AvatarPrimitive.Image` so Radix can set loading status to `error` when the src is cleared. Early-return `null` leaves context stuck at `loaded` and hides `AvatarFallback`. */
	const resolvedSrc =
		src != null && typeof src === 'string' && src.trim() !== ''
			? src
			: undefined

	return (
		<AvatarPrimitive.Image
			data-slot='avatar-image'
			className={cn('aspect-square size-full', className)}
			src={resolvedSrc}
			{...props}
		/>
	)
}

function AvatarFallback({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
	return (
		<AvatarPrimitive.Fallback
			data-slot='avatar-fallback'
			className={cn(
				'bg-muted flex size-full items-center justify-center rounded-full',
				className,
			)}
			{...props}
		/>
	)
}

export { Avatar, AvatarImage, AvatarFallback }
