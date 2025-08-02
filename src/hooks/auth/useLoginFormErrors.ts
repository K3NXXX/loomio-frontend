import { useEffect } from 'react'

import { toast } from 'sonner'

import type { TLoginSchema } from '@/schemas/auth/login-schema'

type ErrorsType = Partial<Record<keyof TLoginSchema, { message?: string }>>

export const useLoginFormErrors = (errors: ErrorsType) => {
	useEffect(() => {
		const fields = ['password', 'identifier'] as const

		fields.forEach((field) => {
			const message = errors[field]?.message
			if (message) {
				toast.error(message)
			}
		})
	}, [errors, errors.password])
}
