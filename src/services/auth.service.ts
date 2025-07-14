import { IEmailVerification, IEmailVerificationResponse, ILogInApiData, ISignupApiData } from '@/types/auth.types'
import axios from 'axios'

class AuthService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/auth`

	async signup(signUpData: ISignupApiData) {
		const {data} = await axios.post(`${this.BASE_URL}/register`, signUpData)
		return data
	}
	async login(logInData: ILogInApiData) {
		const {data} = await axios.post(`${this.BASE_URL}/login`, logInData)
		return data
	}

	async emailVerification(code: IEmailVerification): Promise<IEmailVerificationResponse> {
		const {data} = await axios.post(`${this.BASE_URL}/register/verify`, code)
		return data
	}
}

export const authService = new AuthService()
