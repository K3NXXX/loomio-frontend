import { paymentsService } from '@/services/payment.service'
import { useState } from 'react'
import { toast } from 'sonner'

export const useCreateCheckoutSession = () => {
	const [isPending, setIsPending] = useState(false)

	const createCheckoutSession = async () => {
		setIsPending(true)
		try {
			const { url } = await paymentsService.createCheckoutSession()
			window.location.href = url
		} catch {
			toast.error('Failed to create checkout session')
		} finally {
			setIsPending(false)
		}
	}

	return { createCheckoutSession, isPending }
}
