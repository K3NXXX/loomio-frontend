export const truncateName = (name: string, maxLength: number): string => {
	if (!name) return ''
	return name.length > maxLength ? name.slice(0, maxLength) + '…' : name
}
