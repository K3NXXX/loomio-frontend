'use client'

import type { TEditAccountSchema } from '@/schemas/account/edit-account.schema'
import { useEffect } from 'react'
import { toast } from 'sonner'

type ErrorsType = Partial<
	Record<keyof TEditAccountSchema, { message?: string }>
>

export const useEditAccountFormErrors = (errors: ErrorsType) => {
	useEffect(() => {
		const fields: (keyof TEditAccountSchema)[] = [
			'name',
			'email',
			'bio',
			'newPassword',
			'currentPassword',
		]

		fields.forEach((field) => {
			const message = errors[field]?.message
			if (message) {
				toast.error(message)
			}
		})
	}, [errors])
}
