export const updateGreeting = () => {
	const timeSegments = [
		[0, 3, '夜深了'],
		[3, 6, '凌晨好'],
		[6, 12, '早上好'],
		[12, 18, '下午好'],
		[18, 23, '晚上好'],
		[23, 24, '夜深了']
	];
	const now = new Date();
	const hour = now.getHours();
	for (const segment of timeSegments) {
		if (hour >= segment[0] && hour < segment[1]) {
			document.body.style.setProperty('--md-greeting', `'${segment[2]}'`);
			break;
		}
	}
}

export const updateDailyRecommendationDate = () => {
	const ele = document.querySelector('.u-cover-daily .date .day');
	if (!ele) return;
	const newDate = (new Date().getHours() < 8 ? new Date(Date.now() - 86400000) : new Date()).getDate();
	if (ele.innerText != newDate) {
		ele.innerText = newDate;
	}
}
