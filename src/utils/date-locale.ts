/** Maps next-intl cookie locale to `Intl` / `Date` locale tag for formatting. */
export function getDateLocaleTag(appLocale: string): string {
	return appLocale === 'uk' ? 'uk-UA' : 'en-GB'
}
