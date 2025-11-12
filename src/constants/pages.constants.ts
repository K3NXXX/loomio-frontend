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
	WORKPLACE_DASHBOARD: (username: string) =>
		`/workplace/channel/@${username}/dashboard`,
	WORKPLACE_CONTENT: (username: string) =>
		`/workplace/channel/@${username}/content`,
	WORKPLACE_BRANDING: (username: string) =>
		`/workplace/channel/@${username}/branding`,
	SEARCH: (query: string) => `/search?query=${query}`,
	PLAYLISTS: '/playlists',
	ONE_USER_PLAYLIST: (id: string) => `/playlists/${id}`,
	FOLLOWINGS: '/followings',
}
