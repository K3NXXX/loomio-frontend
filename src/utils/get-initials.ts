export const getInitials = (name: string | undefined): string => {
	if (!name) return ''
	return name.trim()[0].toUpperCase()
}
