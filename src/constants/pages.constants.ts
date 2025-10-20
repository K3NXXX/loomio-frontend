export const PAGES = {
	HOME: '/',
	SIGNUP: '/signup',
	LOGIN: '/login',
	FORGOT_PASSWORD: 'forgot-password',
	PASSWORD_RESET: 'password-reset',
	ACCOUNT: '/account',
	CHANNELS: '/account/channels',
	EDIT_ACCOUNT: 'account/edit-account',
	WATCH: (id: string) => `/watch?v=${id}`,
	CHANNEL: (username: string) => `/@${username}`,
}
