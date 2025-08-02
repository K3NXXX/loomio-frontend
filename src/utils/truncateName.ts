export const truncateName = (name: string, maxLength = 20): string => {
	if (!name) return ''
	return name.length > maxLength ? name.slice(0, maxLength) + '…' : name
}
