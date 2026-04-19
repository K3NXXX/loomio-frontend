const VALIDATION_KEY_BY_MESSAGE: Record<string, string> = {
	'Please enter your email or username': 'validation.auth.identifierRequired',
	'Must be less than 100 characters': 'validation.common.max100',
	'Enter a valid email address or username': 'validation.auth.identifierInvalid',
	'Password is required': 'validation.auth.passwordRequired',
	'Password requires min 10 characters': 'validation.auth.passwordMin10',
	'Username is required': 'validation.auth.usernameRequired',
	'Username must be at least 3 character': 'validation.auth.usernameMin3',
	'Username must be at least 3 characters': 'validation.auth.usernameMin3',
	'Username must be at most 39 characters': 'validation.auth.usernameMax39',
	'Username should contain only letters, numbers, single hyphens.':
		'validation.auth.usernameSlug',
	'Email is required': 'validation.auth.emailRequired',
	'Incorrect email': 'validation.auth.emailInvalid',
	'Email requires max 100 characters': 'validation.auth.emailMax100',
	'Password must contain at least one latin letter, one digit, and one special character':
		'validation.auth.passwordComplex',
	'Please confirm your password': 'validation.auth.passwordConfirmRequired',
	'You must agree to the terms and conditions': 'validation.auth.termsRequired',
	'Passwords do not match': 'validation.auth.passwordsMismatch',
	'Invalid code': 'validation.auth.codeInvalid',
	'Code must contain only letters and digits': 'validation.auth.codeAlnum',
	'Channel name is required': 'validation.channel.nameRequired',
	'Channel name must be at least 2 characters': 'validation.channel.nameMin2',
	'Channel name must be less than 50 characters': 'validation.channel.nameMax50',
	'Name can contain only letters, numbers, spaces, apostrophes, or dashes':
		'validation.channel.namePattern',
	'Username must be at most 20 characters': 'validation.channel.usernameMax20',
	'Username must contain only lowercase letters, numbers, and underscores':
		'validation.channel.usernameLowerUnderscore',
	'Invalid avatar URL': 'validation.channel.avatarUrlInvalid',
	'Name must contain exactly two words with only letters':
		'validation.account.nameTwoWords',
	'Name must be less than 100 characters': 'validation.account.nameMax100',
	'Bio must be less than 500 characters': 'validation.account.bioMax500',
	'Current password is required': 'validation.account.currentPasswordRequired',
	'New password must be different from current password':
		'validation.account.newPasswordDifferent',
	'Playlist name is required': 'validation.playlist.nameRequired',
	'Playlist name must be at least 2 characters': 'validation.playlist.nameMin2',
	'Name must be under 100 characters': 'validation.playlist.nameMax100',
	'Description must be under 500 characters':
		'validation.playlist.descriptionMax500',
	'Title must be at least 3 characters': 'validation.video.titleMin3',
	'Title must be less than 200 characters': 'validation.video.titleMax200',
	'Description must be less than 1000 characters':
		'validation.video.descriptionMax1000',
	'Invalid tags format': 'validation.video.tagsInvalid',
	'Video file is required': 'validation.video.fileRequired',
	'Thumbnail is required': 'validation.video.thumbnailRequired',
	'Visibility is required': 'validation.video.visibilityRequired',
	'You must specify if the content is made for kids':
		'validation.video.audienceRequired',
	'You must choose when to publish': 'validation.video.publishTypeRequired',
	'Publish date is required when scheduling': 'validation.video.publishDateRequired',
	'Publish date is required when scheduling a video':
		'validation.video.publishDateRequired',
	'Select a reason': 'validation.report.reasonRequired',
	'Please provide more details': 'validation.report.messageRequired',
	'File must be an image': 'validation.file.imageOnly',
	'File is required': 'validation.file.required',
	'File size must be ≤ 6 MB': 'validation.file.maxMb6',
}

export function getValidationMessage(
	rawMessage: string | undefined,
	t: (key: string) => string,
) {
	if (!rawMessage) return ''
	const key = VALIDATION_KEY_BY_MESSAGE[rawMessage]
	return key ? t(key) : rawMessage
}
