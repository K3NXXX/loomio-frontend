import axiosInstance from '@/lib/axios'

class PaymentService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/payments`

	async createCheckoutSession(): Promise<{ url: string }> {
		const { data } = await axiosInstance.post<{ url: string }>(
			`${this.BASE_URL}/create-checkout-session`,
		)
		return data
	}

	async confirmCheckout(sessionId: string): Promise<{ isPremium: boolean }> {
		const { data } = await axiosInstance.post<{ isPremium: boolean }>(
			`${this.BASE_URL}/confirm-checkout`,
			{ sessionId },
		)
		return data
	}
}
export const paymentsService = new PaymentService()
