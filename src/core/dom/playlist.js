export const isPlaylistSpecial = (dom) => {
	if (dom.querySelector(".date .day")) {
		return true;
	}
	const title = dom.querySelector('.desc a *')?.innerText;
	if (!title) return false;
	if (dom.classList.contains('processed')) {
		return true;
	}
	if (title.endsWith("私人雷达")) {
		return true;
	}
	if (title.match(/^\[(.*?)\] /)) {
		return true;
	}
	return false;
}

export const processPlaylistTitles = () => {
	const items = document.querySelectorAll('.md-today-recommend li');
	for (let item of items) {
		if (item.classList.contains('processed')) {
			continue;
		}
		const title = item.querySelector('.desc a *');
		if (!title) continue;
		if (title.innerText.endsWith('私人雷达')) {
			const subtitle = (title.innerText.match(/《(.*?)》/) ?? ['', '根据听歌记录为你打造'])[1];
			title.innerHTML = '私人雷达';
			title.insertAdjacentHTML('afterend', `<div class="subtitle">${subtitle}</div>`);
			item.classList.add('processed');
		}
		if (title && title.innerText.match(/^\[(.*?)\] /)) {
			title.innerHTML = title.innerText.match(/^\[(.*?)\] /)[1];
			item.classList.add('processed');
		}
	}
}

export const playlistMovetoSpecific = (dom) => {
	const recommendBox = document.querySelector(".md-today-recommend");

	const link = dom.querySelector('a.lnk').href;
	for (const item of recommendBox.querySelectorAll('li')) {
		if (item.querySelector('a.lnk').href == link) {
			dom.remove();
			return;
		}
	}

	const playBtn = dom.querySelector('.ply');
	dom.appendChild(playBtn);

	recommendBox.appendChild(dom);
}

export const playlistMovetoNormal = (dom) => {
	const listBox = document.querySelector('.g-mn .p-recmd .m-list-recmd[data-nej-selector="__nPlaylistBox"]');

	const link = dom.querySelector('a.lnk').href;
	for (const item of listBox.querySelectorAll('li')) {
		if (item.querySelector('a.lnk').href == link) {
			dom.remove();
			return;
		}
	}

	const playBtn = dom.querySelector('.ply');
	dom.querySelector('.cvr').appendChild(playBtn);

	listBox.appendChild(dom);
}

export const updateRecommendPlaylists = () => {
	const listBox = document.querySelector('.g-mn .p-recmd .m-list-recmd[data-nej-selector="__nPlaylistBox"]');
	let pos = 0;
	while (pos < listBox.children.length) {
		const item = listBox.children[pos];
		if (isPlaylistSpecial(item)) {
			playlistMovetoSpecific(item);
		} else {
			pos++;
		}
	}
	processPlaylistTitles();

	const recommendBox = document.querySelector(".md-today-recommend");
	pos = 0;
	while (pos < recommendBox.children.length) {
		const item = recommendBox.children[pos];
		if (!isPlaylistSpecial(item)) {
			playlistMovetoNormal(item);
		} else {
			pos++;
		}
	}	
}

export const initRecommendPlaylists = () => {
	const container = document.querySelector('.g-mn .p-recmd:not(.patched)');
	if (!container) {
		return;
	}

	const bannerBox = container.querySelector('.g-mn .p-recmd .m-banner');

	const recommendBox = document.createElement('div');
	recommendBox.classList.add('md-today-recommend');
	bannerBox.parentNode.insertBefore(recommendBox, bannerBox.nextSibling);

	container.classList.add('patched');
	if (window.initRecommendPlaylistsInterval) {
		clearInterval(window.initRecommendPlaylistsInterval);
	}
	updateRecommendPlaylists();
}

export const removeRedundantPlaylists = () => {
	const listBox = document.querySelector('.g-mn .p-recmd .m-list-recmd[data-nej-selector="__nPlaylistBox"]');
	if (!listBox) {
		return;
	}
	updateRecommendPlaylists();
}

export const scrollToCurrentPlaying = () => {
	const currentPlaying = document.querySelector('.m-plylist .itm.z-play') ?? document.querySelector('.m-plylist .itm.z-pause');
	if (!currentPlaying) {
        // TODO: Import makeToast if needed or handle differently
        // For now assuming makeToast is global or not using it here directly without importing
        // But it was used in main.js. I should import it from utils.
		return;
	}
	const itemHeight = parseInt(getComputedStyle(document.querySelector('.m-plylist')).getPropertyValue('--item-height') || 50);
	const currentPlayingIndex =
		Array.from(currentPlaying.parentNode.parentNode.children).indexOf(currentPlaying.parentNode) * 20 +
		Array.from(currentPlaying.parentNode.children).indexOf(currentPlaying) + 1;
	const currentPlayingOffset = 
		document.querySelector('.m-plylist ul').offsetTop -
		(document.documentElement.clientHeight / 2) +
		currentPlayingIndex * itemHeight + 100;
	document.querySelector('.g-mn:not(.better-ncm-manager)').scrollTo(0, currentPlayingOffset);
}
