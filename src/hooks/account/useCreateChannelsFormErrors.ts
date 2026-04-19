'use client'

import type { CreateChannelSchema } from '@/schemas/account/create-channel.schema'
import { getValidationMessage } from '@/utils/validationMessage'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { toast } from 'sonner'

type ErrorsType = Partial<
	Record<keyof CreateChannelSchema, { message?: string }>
>

export const useCreateChannelFormErrors = (errors: ErrorsType) => {
	const t = useTranslations()

	useEffect(() => {
		const fields: (keyof CreateChannelSchema)[] = ['name', 'username']

		fields.forEach((field) => {
			const message = errors[field]?.message
			if (message) toast.error(getValidationMessage(message, t))
		})
	}, [errors, t])
}
