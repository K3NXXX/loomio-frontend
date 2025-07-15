import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://nextgen-n55f.onrender.com',
	withCredentials: true,
})

export default instance
