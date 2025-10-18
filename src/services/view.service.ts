import axiosInstance from '@/lib/axios'

class ViewService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/views`

	async addView(videoId: string): Promise<{ success: boolean }> {
		const { data } = await axiosInstance.post<{ success: boolean }>(
			`${this.BASE_URL}/${videoId}`,
			{ userAgent: navigator.userAgent },
		)
		return data
	}
}

export const viewService = new ViewService()
