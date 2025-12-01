let lastPlaylistTitle = "";
const titleSizeController = document.createElement('style');
titleSizeController.innerHTML = '';
document.head.appendChild(titleSizeController);

export const recalculateTitleSize = (forceRefresh = false) => {
	const title = document.querySelector('.g-mn .m-info .tit .name h2 .f-ust');
	if (!title) {
		return;
	}
	if (title.innerText === lastPlaylistTitle && !forceRefresh) {
		return;
	}
	lastPlaylistTitle = title.innerText;
	const text = title.innerText;
	const testDiv = document.createElement('div');
	testDiv.style.position = 'absolute';
	testDiv.style.top = '-9999px';
	testDiv.style.left = '-9999px';
	testDiv.style.width = 'auto';
	testDiv.style.height = 'auto';
	testDiv.style.whiteSpace = 'nowrap';
	testDiv.innerText = text;
	document.body.appendChild(testDiv);

	const maxThreshold = 80;
	const minThreshold = 24;
	const targetWidth = document.querySelector('.g-mn .m-info .tit .name').clientWidth - 30;

	let l = 1, r = 61;
	while (l < r) {
		const mid = Math.floor((l + r) / 2);
		testDiv.style.fontSize = `${mid}px`;
		const width = testDiv.clientWidth;
		if (width > targetWidth) {
			r = mid;
		} else {
			l = mid + 1;
		}
	}
	let fontSize = l - 1;
	fontSize = Math.max(Math.min(fontSize, maxThreshold), minThreshold);
	document.body.removeChild(testDiv);
	titleSizeController.innerHTML = `
		.g-mn .m-info .tit .name h2 {
			font-size: ${fontSize}px !important;
		}
	`;
}
