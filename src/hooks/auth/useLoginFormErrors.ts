'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { toast } from 'sonner'

import type { TLoginSchema } from '@/schemas/auth/login-schema'
import { getValidationMessage } from '@/utils/validationMessage'

type ErrorsType = Partial<Record<keyof TLoginSchema, { message?: string }>>

export const useLoginFormErrors = (errors: ErrorsType) => {
	const t = useTranslations()

	useEffect(() => {
		const fields = ['password', 'identifier'] as const

		fields.forEach((field) => {
			const message = errors[field]?.message
			if (message) {
				toast.error(getValidationMessage(message, t))
			}
		})
	}, [errors, errors.password, t])
}
