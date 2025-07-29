import { useEffect } from 'react'

import { toast } from 'sonner'

interface ISignupFormErrors {
	errors: Record<string, { message?: string } | undefined>
}

export function SignupFormErrors({ errors }: ISignupFormErrors) {
	useEffect(() => {
		if (errors.fullName?.message) {
			toast(errors.fullName.message)
		}
		if (errors.username?.message) {
			toast(errors.username.message)
		}
		if (errors.email?.message) {
			toast(errors.email.message)
		}
		if (errors.password?.message) {
			toast(errors.password.message)
		}
		if (errors.passwordConfirm?.message) {
			toast(errors.passwordConfirm.message)
		}
		if (errors.termsAccepted?.message) {
			toast(errors.termsAccepted.message)
		}
	}, [
		errors.fullName,
		errors.username,
		errors.email,
		errors.password,
		errors.passwordConfirm,
		errors.termsAccepted,
	])

	return <></>
}
