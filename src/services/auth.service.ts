import axios from 'axios'

class AuthService {
	private BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  
	// async signup() {
	//   const response = await axios.post<>(this.BASE_URL);
	//   return response;
	}
  

  
  export const authService = new AuthService();