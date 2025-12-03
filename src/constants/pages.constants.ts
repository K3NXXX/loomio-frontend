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
	WATCH_WITH_COMMENT: (videoId: string, commentId: string) =>
		`/watch?v=${videoId}&commentId=${commentId}`,
	CHANNEL: (username: string) => `/@${username}`,
	WORKPLACE_DASHBOARD: (username: string) =>
		`/workplace/channel/@${username}/dashboard`,
	WORKPLACE_CONTENT: (username: string) =>
		`/workplace/channel/@${username}/content`,
	WORKPLACE_BRANDING: (username: string) =>
		`/workplace/channel/@${username}/branding`,
	WORKPLACE_DANGER_ZONE: (username: string) =>
		`/workplace/channel/@${username}/danger-zone`,
	SEARCH: (query: string) => `/search?query=${query}`,
	PLAYLISTS: '/playlists',
	ONE_USER_PLAYLIST: (id: string) => `/playlists/${id}`,
	FOLLOWINGS: '/followings',
	MODERATION_DASHBOARD: '/moderation/dashboard',
	MODERATION_COMMENT_REPORTS: '/moderation/comment-reports',
	MODERATION_VIDEO_REPORTS: '/moderation/video-reports',
	MODERATION_COMMENT_HISTORY: '/moderation/comment-history',
	MODERATION_VIDEO_HISTORY: '/moderation/video-history',
}
