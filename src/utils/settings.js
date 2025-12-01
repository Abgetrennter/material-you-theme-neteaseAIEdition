export const getSetting = (option, defaultValue = '') => {
	const key = "material-you-theme-" + option;
	let value = localStorage.getItem(key);
	if (value === null || value === undefined) {
		value = defaultValue;
	}
	if (value === 'true') {
		value = true;
	} else if (value === 'false') {
		value = false;
	}
	return value;
}

export const setSetting = (option, value) => {
	const key = "material-you-theme-" + option;
	localStorage.setItem(key, value);
}
