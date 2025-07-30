export const getInitials = (name: string | undefined): string => {
	if (!name) {
		return ''
	}
	return name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.toUpperCase()
}
