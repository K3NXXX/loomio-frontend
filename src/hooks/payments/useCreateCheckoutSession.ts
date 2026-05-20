import { paymentsService } from '@/services/payment.service'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

export const useCreateCheckoutSession = () => {
	const [isPending, setIsPending] = useState(false)
	const t = useTranslations('toast')

	const createCheckoutSession = async () => {
		setIsPending(true)
		try {
			const { url } = await paymentsService.createCheckoutSession()
			window.location.href = url
		} catch {
			toast.error(t('checkoutSessionFailed'))
		} finally {
			setIsPending(false)
		}
	}

	return { createCheckoutSession, isPending }
}
