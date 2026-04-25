import axiosInstance from '@/lib/axios'

class PaymentService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/payments`

	async createCheckoutSession(): Promise<{ url: string }> {
		const { data } = await axiosInstance.post<{ url: string }>(
			`${this.BASE_URL}/create-checkout-session`,
		)
		return data
	}
}
//
export const paymentsService = new PaymentService()
