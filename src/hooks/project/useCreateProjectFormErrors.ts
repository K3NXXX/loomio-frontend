import { useEffect } from 'react'

import { toast } from 'sonner'

import type { FieldErrors } from 'react-hook-form'

export function useCreateProjectFormErrors<T extends FieldErrors>(
	errors: FieldErrors<T>,
) {
	useEffect(() => {
		Object.values(errors).forEach((error: any) => {
			if (error?.message) {
				toast(error.message)
			}
		})
	}, [errors])
}
