import { useEffect } from 'react'

import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'

import type { TSignupSchema } from '@/schemas/auth/signup-schema'

export const useSignupFormErrors = () => {
	const {
		formState: { errors },
	} = useFormContext<TSignupSchema>()

	useEffect(() => {
		const fields = [
			'termsAccepted',
			'passwordConfirm',
			'password',
			'email',
			'username',
			'name',
		] as const

		fields.forEach((field) => {
			const message = errors[field]?.message
			if (message) {
				toast.error(message)
			}
		})
	}, [
		errors,
		errors.password,
		errors.passwordConfirm,
		errors.termsAccepted,
		errors.email,
		errors.username,
		errors.name,
	])
}
