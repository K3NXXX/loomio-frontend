'use client'

import type { TEditAccountSchema } from '@/schemas/account/edit-account.schema'
import { getValidationMessage } from '@/utils/validationMessage'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { toast } from 'sonner'

type ErrorsType = Partial<
	Record<keyof TEditAccountSchema, { message?: string }>
>

export const useEditAccountFormErrors = (errors: ErrorsType) => {
	const t = useTranslations()

	useEffect(() => {
		const fields: (keyof TEditAccountSchema)[] = [
			'name',
			'email',
			'bio',
			'username',
			'newPassword',
			'currentPassword',
			'confirmPassword',
		]

		fields.forEach((field) => {
			const message = errors[field]?.message
			if (message) {
				toast.error(getValidationMessage(message, t))
			}
		})
	}, [errors, t])
}
