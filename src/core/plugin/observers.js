import { waitForElement, waitForElementAsync, makeToast } from "../../utils/dom.js";
import { debounce } from "../../utils/common.js";
import { TimeIndicator } from "../../components/TimeIndicator/index.js";
import { ListViewSwitcher } from "../../components/ListViewSwitcher/index.js";
import { initSettingMenu } from "../../components/Settings/index.js";
import { overrideNCMCSS } from "../theme/applyScheme.js";
import { updateDynamicColorFromCover, updateDynamicColorFromBGEnhanced } from "../theme/dynamicTheme.js";
import { initRecommendPlaylists, removeRedundantPlaylists, scrollToCurrentPlaying } from "../dom/playlist.js";
import { recalculateTitleSize } from "../dom/titleSize.js";
import { updateGreeting, updateDailyRecommendationDate } from "../dom/greeting.js";

export const initObservers = () => {
    // Listen hash change and add attribute
	window.addEventListener('hashchange', () => {
		document.body.setAttribute('page-hash', window.location.hash);
	});

	// Alternative time indicator
    const injectTimeIndicator = (selector) => {
        waitForElement(selector, (dom) => {
            const timeIndicator = document.createElement('div');
            timeIndicator.style.position = 'unset';
            timeIndicator.classList.add('time-indicator-container', 'md-time-indicator-container');
            dom.appendChild(timeIndicator);
            ReactDOM.render(<TimeIndicator parentDOM={dom}/>, timeIndicator);
        });
    }
    injectTimeIndicator('#main-player');
    injectTimeIndicator('.m-player-fm');

	// Alternative jump to playing location button
	waitForElement('#main-player', (dom) => {
		const queueNotifyToast = document.querySelector('#main-player .list .m-queuenotify');
		new MutationObserver(() => {
			const jumpToPlaylocationBtn = document.querySelector('button.u-playinglocation');
			if (!jumpToPlaylocationBtn) {
				return;
			}
			if (queueNotifyToast.classList.contains('f-dn')) {
				jumpToPlaylocationBtn.classList.remove('pull-up');
			} else {
				jumpToPlaylocationBtn.classList.add('pull-up');
			}
		}).observe(queueNotifyToast, { attributes: true, attributeFilter: ['class'] });
	});

	// Greeting, recommend playlists, and main content observers
	setInterval(() => {
		updateGreeting();
		updateDailyRecommendationDate();
	}, 30000);
	updateGreeting();

	waitForElement('.g-mn', (dom) => {
        const observerCallback = debounce(() => {
            // Recommend Playlists
            try { initRecommendPlaylists(); } catch (e) {}
            removeRedundantPlaylists();

            // Action buttons innerText to css property
			const buttons = document.querySelectorAll('.u-ibtn5');
			for (let button of buttons) {
				button.style.setProperty('--text', `'${button.innerText}'`);
			}
			// Artist Info: Songs, Albums, MV counts
			const artistInfoItems = document.querySelectorAll('.g-mn .m-info .inf .item');
			for (let item of artistInfoItems) {
                const match = item.innerHTML.match(/(\d+)/);
                if (match) {
				    item.style.setProperty('--number', `'${match[1]}'`);
                }
			}
			
			// Playlist title size recalculation
			recalculateTitleSize();

			// Add custom jump to playing button
			if (document.querySelector('.u-playinglocation')) {
				if (!document.querySelector('.u-playinglocation + .u-playinglocation')) {
					const button = document.createElement('button');
					button.classList.add('u-playinglocation', 'j-flag');
					button.innerHTML = '<svg><use xlink:href="orpheus://orpheus/style/res/svg/icon.sp.svg#playinglocation"></use></svg>';
					button.addEventListener('click', () => {
						scrollToCurrentPlaying();
					});
                    const originalBtn = document.querySelector('.u-playinglocation');
                    if (originalBtn && originalBtn.parentNode) {
					    originalBtn.after(button);
                    }
				}
			}
        }, 200);

		new MutationObserver(observerCallback).observe(dom, { childList: true, subtree: true });
		
        // Keep a less frequent interval as fallback for playlist initialization
        window.initRecommendPlaylistsInterval = setInterval(() => {
			try { initRecommendPlaylists();} catch (e) {}
		}, 1000);
	});
	window.addEventListener('resize', () => {
		recalculateTitleSize();
	});

	// observer theme change
	new MutationObserver(() => { overrideNCMCSS('pri-skin-gride'); }).observe(document.getElementById('pri-skin-gride'), { attributes: true });
	new MutationObserver(() => { overrideNCMCSS('skin_default'); }).observe(document.getElementById('skin_default'), { attributes: true });

	// init setting menu
	waitForElement('header .m-tool .user', (dom) => {
		initSettingMenu();
	});

	// Fix toolbar button offset
	waitForElement('.g-sd', (dom) => {
		const toolbarLeftPart = document.querySelector('header.g-hd .m-leftbox');
		new MutationObserver(() => {
			document.body.style.setProperty('--sidebar-width', `${parseInt(dom.style?.width || 199)}px`);
			toolbarLeftPart.style.setProperty('--offset', `${parseInt(dom.style?.width || 199) - 199}px`);
			document.body.classList.add('sidebar-width-adjusted');
		}).observe(dom, { attributes: true, attributeFilter: ['style'] });
		document.body.style.setProperty('--sidebar-width', `${parseInt(dom.style?.width || 199)}px`);
		toolbarLeftPart.style.setProperty('--offset', `${parseInt(dom.style?.width || 199) - 199}px`);
	});
	
	// Dynamic scheme color (cover)
	waitForElement('.m-pinfo', (dom) => {
		let oldSrc = '';
		const update = () => {
			const img = dom.querySelector('.j-cover');
			if (oldSrc == img?.src) return;
			if (img?.complete) {
				oldSrc = img.src;
				updateDynamicColorFromCover();
			} else {
				img?.addEventListener('load', () => {
					update();
				});
			}
		};
		new MutationObserver(() => {
			update();
		}).observe(dom, { childList: true, subtree: true });
		update();
	});

	// Dynamic scheme color (BGEnhanced)
	if (document.body.classList.contains('BGEnhanced')) {
		waitForElement('.BGEnhanced-BackgoundDom .background', (dom) => {
			let oldSrc = '';
			const update = () => {
				const img = dom.querySelector('img');
				if (oldSrc == img?.src) return;
				if (img?.complete) {
					oldSrc = img.src;
					updateDynamicColorFromBGEnhanced();
				} else {
					img?.addEventListener('load', () => {
						update();
					});
				}
			};
			new MutationObserver(() => {
				update();
			}).observe(dom, { childList: true, subtree: true });
			update();
		});
	}

	// Add list view switcher
	window.addEventListener('hashchange', async () => {
		let targetContainer = null;
		if (window.location.hash.includes('m/playlist')) {
			targetContainer = await waitForElementAsync('.g-mn .u-tab2 .m-lstoper');
		} else if (window.location.hash.includes('m/dailysong')) {
			targetContainer = await waitForElementAsync('.g-mn .m-plylist .hd');
		}
		if (!targetContainer) {
			return;
		}
		if (targetContainer.classList.contains('md-list-switcher-patched')) {
			return;
		}
		targetContainer.classList.add('md-list-switcher-patched');
		const switcher = document.createElement('div');
		switcher.classList.add('md-list-view-switcher');
		ReactDOM.render(<ListViewSwitcher />, switcher);
		targetContainer.appendChild(switcher);
	});
}
