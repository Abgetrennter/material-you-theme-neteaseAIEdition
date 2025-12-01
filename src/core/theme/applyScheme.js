import { getSetting } from "../../utils/settings.js";
import { schemePresets } from "./presets.js";
import { updateDynamicTheme } from "./dynamicTheme.js";

const updateAccentColor = ([r, g, b], name = '') => {
	if (name == '' || name == 'primary') {
		name = '--md-accent-color';
	} else {
		name = '--md-accent-color-' + name;
	}
	document.body.style.setProperty(name, `rgb(${r}, ${g}, ${b})`);
	document.body.style.setProperty(name + '-rgb', `${r}, ${g}, ${b}`);
}

const setHref = (id, href) => {
	const dom = document.getElementById(id);
	if (!dom) {
		return;
	}
	if (dom.href != href) {
		dom.href = href;
	}
}

const overrideNCMCSS = (mutated) => {
	if (mutated == 'pri-skin-gride') {
		setHref(
			'pri-skin-gride',
			window.mdThemeType == 'dark' ? 'orpheus://skin/default/default/web/css/skin.ls.css' : 'orpheus://skin/default/red/web/css/skin.ls.css'
		);
	} else if (mutated == 'skin_default') {
		if (document.getElementById('skin_fullscreen').href.endsWith(".css")) {
			return;
		}
		setHref(
			'skin_default',
			window.mdThemeType == 'dark' ? 'orpheus://orpheus/style/res/less/default/css/skin.ls.css' : 'orpheus://orpheus/pub/app.html'
		);
	}
}

export const updateNativeTheme = () => {
	if (window.mdThemeType == 'dark') {
		channel.call('app.loadSkinPackets', ()=>{}, ["default", "default", {btn_color: {h: 0, s: 89, l: 59}}]);
	} else {
		channel.call('app.loadSkinPackets', ()=>{}, ["default", "red", {btn_color: {h: 0, s: 89, l: 59}}]);
	}
}

export const applyScheme = (scheme) => {
	window.mdScheme = scheme;
	if (scheme.startsWith('dynamic')) {
		document.body.classList.add('md-dynamic-theme');
		document.body.classList.remove('md-dynamic-theme-light', 'md-dynamic-theme-dark', 'md-dynamic-theme-auto');
		const mode = scheme.split('-').slice(-1)[0];
		document.body.classList.add(`md-dynamic-theme-${mode}`);
		if (mode != 'auto') {
			window.mdThemeType = mode;
			overrideNCMCSS('pri-skin-gride');
			overrideNCMCSS('skin_default');
			updateNativeTheme();
		}
		window.mdScheme = scheme;
		updateDynamicTheme();
		return;
	} else {
		document.body.classList.remove('md-dynamic-theme');
	}

	let preset;
	if (scheme == 'custom') {
		preset = JSON.parse(getSetting('custom-scheme', JSON.stringify(schemePresets['dark-blue'])));
	} else {
		if (!schemePresets[scheme]) {
			scheme = 'dark-blue';
		}
		preset = schemePresets[scheme];
	}

	preset['secondary'] ??= preset['primary'];

	if (preset['light']) {
		preset['grey-base'] ??= [0, 0, 0];
		window.mdThemeType = 'light';
	} else {
		preset['grey-base'] ??= [255, 255, 255];
		window.mdThemeType = 'dark';
	}
	for (const name in preset) {
		if (name == 'light') {
			continue;
		}
		updateAccentColor(preset[name], name);
	}
	overrideNCMCSS('pri-skin-gride');
	overrideNCMCSS('skin_default');
	updateNativeTheme();
}

export { overrideNCMCSS };
