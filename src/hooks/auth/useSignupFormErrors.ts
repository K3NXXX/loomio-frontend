'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'

import type { TSignupSchema } from '@/schemas/auth/signup-schema'
import { getValidationMessage } from '@/utils/validationMessage'

export const useSignupFormErrors = () => {
	const t = useTranslations()

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
				toast.error(getValidationMessage(message, t))
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
		t,
	])
}
