import { getSetting } from "../../utils/settings.js";
import { overrideNCMCSS, updateNativeTheme } from "../theme/applyScheme.js";

export const addOrRemoveGlobalClassByOption = (className, optionValue) => {
	if (optionValue) {
		document.body.classList.add(className);
	} else {
		document.body.classList.remove(className);
	}
}

export const initSettings = () => {
	// applyScheme(getSetting('scheme', 'dynamic-default-auto')); // Moved to caller

	addOrRemoveGlobalClassByOption('ignore-now-playing', getSetting('ignore-now-playing-page', false));
	addOrRemoveGlobalClassByOption('md-disable-comment-style', getSetting('disable-comment-style', false));
	addOrRemoveGlobalClassByOption('hide-ncm-logo', getSetting('hide-ncm-logo', false));
	addOrRemoveGlobalClassByOption('capsule-sidebar', getSetting('capsule-sidebar', false));
	addOrRemoveGlobalClassByOption('md-disable-new-ui', getSetting('disable-new-ui', false));
	addOrRemoveGlobalClassByOption('floating-bottombar', getSetting('floating-bottombar', false));
	addOrRemoveGlobalClassByOption('transparent-framework', getSetting('transparent-framework', false));
	document.body.style.setProperty('--bottombar-height', `${getSetting('bottombar-height', 90)}px`);
}


export const getCalculatedPrimaryColorBGRHEX = () => { // HEX (Blue Green Red)
	const color = window.getComputedStyle(document.body).getPropertyValue('--md-accent-color');
	const rgb = color.match(/\d+/g);
	if (!rgb) return '000000';
	const bgr = rgb.reverse();
	return bgr.map((v) => parseInt(v).toString(16).padStart(2, '0')).join('');
}

export const hookContextMenu = () => {
    const _channalCall = channel.call;
    channel.call = (name, ...args) => {
        //console.log(name, args);
        if (name === 'winhelper.updateMenuItem') {
            const primary = `#ff${getCalculatedPrimaryColorBGRHEX()}`;
            args[1] = args[1].map((item) => {
                if (item.color) item.color = primary;
                return item;
            });
        } else if (name === 'winhelper.popupMenu') {
            const primary = `#ff${getCalculatedPrimaryColorBGRHEX()}`;
            let content = JSON.parse(args[1][0].content);
            //console.log(content);
            content = content.map((item) => {
                if (item.image_color) item.image_color = primary;
                return item;
            });
            args[1][0].content = JSON.stringify(content);
        }
        _channalCall(name, ...args);
    };
}

export const setupThemeListener = () => {
    const toggleSystemDarkmodeClass = (media) => {
		document.body.classList.add(media.matches ? 'md-dark' : 'md-light');
		document.body.classList.remove(media.matches ? 'md-light' : 'md-dark');
		if (document.body.classList.contains('md-dynamic-theme-auto')) {
			window.mdThemeType = media.matches ? 'dark' : 'light';
			overrideNCMCSS('pri-skin-gride');
			overrideNCMCSS('skin_default');
			updateNativeTheme();
		}
	};
	const systemDarkmodeMedia = window.matchMedia('(prefers-color-scheme: dark)');
	systemDarkmodeMedia.addEventListener('change', () => { toggleSystemDarkmodeClass(systemDarkmodeMedia); });
	document.body.addEventListener('md-dynamic-theme-auto', () => {	toggleSystemDarkmodeClass(systemDarkmodeMedia); });
	toggleSystemDarkmodeClass(systemDarkmodeMedia);
}
