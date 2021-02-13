const RE_WORDS = /\b[\w']+/g;

export class StringUtilities {
    private static readonly _LOWERCASE_WORDS = [
        'and',
    ];


	/**
	 * returns proper-cased str
	 *
	 * This will consider hyphenated words separately, but will
	 * ignore words with apostrophes (and no spaces).
	 *
	 * from https://stackoverflow.com/a/196991/356016
	 *
	 * @param str
	 */
    public static toProperCase (str: string): string {
		return str.replace(
			RE_WORDS,
			(word) => {
                if (StringUtilities._LOWERCASE_WORDS.includes(word)) {
                    return word.toLowerCase();
                }

                return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
            }
		);
	}
}
