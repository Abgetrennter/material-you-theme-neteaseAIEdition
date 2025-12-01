import { themeFromSourceColor, QuantizerCelebi, Hct, Score, SchemeExpressive, SchemeVibrant, SchemeMonochrome, SchemeFidelity, SchemeTonalSpot, SchemeNeutral, MaterialDynamicColors } from "@material/material-color-utilities";
import { argb2Rgb } from "./colors.js";
import { getSetting } from "../../utils/index.js";

export const getDynamicThemeColor = () => {
	const source = window.mdDynamicThemeColorSource ?? getSetting('dynamic-theme-color-source', 'cover');
	if (source == 'cover') {
		return window.mdCoverDominantColor;
	} else if (source == 'bg-enhanced') {
		return window.mdBGEnhancedDominantColor ?? window.mdCoverDominantColor;
	}
	else {
		const color = window.mdCostomDynamicThemeColor ?? JSON.parse(getSetting('custom-dynamic-theme-color', '[189, 230, 251]'));
		return (color[0] << 16 >>> 0) | (color[1] << 8 >>> 0) | color[2];
	}
}

const defaultDynamicColor = {
	'--md-dynamic-light-primary': 'rgb(103, 80, 164)',
	'--md-dynamic-light-primary-rgb': '103, 80, 164',
	'--md-dynamic-light-secondary': 'rgb(98, 91, 113)',
	'--md-dynamic-light-secondary-rgb': '98, 91, 113',
	'--md-dynamic-light-bg': 'rgb(244, 239, 244)',
	'--md-dynamic-light-bg-rgb': '244, 239, 244',
	'--md-dynamic-light-bg-darken': 'rgb(251, 246, 251)',
	'--md-dynamic-light-bg-darken-rgb': '251, 246, 251',

	'--md-dynamic-dark-primary': 'rgb(208, 188, 255)',
	'--md-dynamic-dark-primary-rgb': '208, 188, 255',
	'--md-dynamic-dark-secondary': 'rgb(204, 194, 220)',
	'--md-dynamic-dark-secondary-rgb': '204, 194, 220',
	'--md-dynamic-dark-bg': 'rgb(49, 48, 51)',
	'--md-dynamic-dark-bg-rgb': '49, 48, 51',
	'--md-dynamic-dark-bg-darken': 'rgb(38, 37, 40)',
	'--md-dynamic-dark-bg-darken-rgb': '38, 37, 40',
};

export const getThemeCSSFromColor = (schemeName = null) => {
	let color = getDynamicThemeColor();
	if (!color) {
		return defaultDynamicColor;
	}
	if (!schemeName) {
		schemeName = window.mdScheme ?? 'dynamic-default-auto';
	}
	if (!schemeName.startsWith('dynamic-')) {
		return '';
	}
	schemeName = schemeName.replace(/^dynamic-/, '');
	schemeName = schemeName.replace(/-(light|dark|auto)$/, '');

	if (schemeName === 'default') {
		const theme = themeFromSourceColor(color);

		theme.schemes.light.bgDarken = (Hct.from(theme.palettes.neutral.hue, theme.palettes.neutral.chroma, 97.5)).toInt();
		theme.schemes.dark.bgDarken = (Hct.from(theme.palettes.neutral.hue, theme.palettes.neutral.chroma, 15)).toInt();

		let newCSSItems = {};
		const updateColor = (colorMode, key, name) => {
			const [r, g, b] = [...argb2Rgb(theme.schemes[colorMode][key])]
			newCSSItems[`--md-dynamic-${colorMode}-${name}`] = `rgb(${r}, ${g}, ${b})`;
			newCSSItems[`--md-dynamic-${colorMode}-${name}-rgb`] = `${r}, ${g}, ${b}`;
		}
		for (let colorMode of ['light', 'dark']) {
			updateColor(colorMode, 'primary', 'primary');
			updateColor(colorMode, 'secondary', 'secondary');
			updateColor(colorMode, 'inverseOnSurface', 'bg');
			updateColor(colorMode, 'bgDarken', 'bg-darken');
		}
		return newCSSItems;
	} else {
		const schemeGenerator = {
			'tonal-spot': SchemeTonalSpot,
			'vibrant': SchemeVibrant,
			'expressive': SchemeExpressive,
			'neutral': SchemeNeutral,
			//'monochrome': SchemeMonochrome,
			'fidelity': SchemeFidelity
		};
		const dynamicScheme = {};
		dynamicScheme.light = new schemeGenerator[schemeName](
			Hct.fromInt(color),
			false,
			0.0
		);
		dynamicScheme.dark = new schemeGenerator[schemeName](
			Hct.fromInt(color),
			true,
			0.0
		);

		let newCSSItems = {};
		const updateColor = (colorMode, key, name) => {
			const [r, g, b] = [...argb2Rgb(MaterialDynamicColors[key].getArgb(dynamicScheme[colorMode]))];
			newCSSItems[`--md-dynamic-${colorMode}-${name}`] = `rgb(${r}, ${g}, ${b})`;
			newCSSItems[`--md-dynamic-${colorMode}-${name}-rgb`] = `${r}, ${g}, ${b}`;
		}
		for (let colorMode of ['light', 'dark']) {
			updateColor(colorMode, 'primary', 'primary');
			updateColor(colorMode, 'secondary', 'secondary');
			updateColor(colorMode, 'background', 'bg');
			updateColor(colorMode, 'surfaceContainerLowest', 'bg-darken');
		}
		return newCSSItems;
	}
}

let dynamicColorController = null;
const ensureController = () => {
    if (!dynamicColorController) {
        dynamicColorController = document.createElement('style');
        document.head.appendChild(dynamicColorController);
    }
}

export const updateDynamicTheme = () => {
    ensureController();
	const CSSItems = getThemeCSSFromColor();
	let CSS = '';
	for (const [key, value] of Object.entries(CSSItems)) {
		CSS += `${key}: ${value};`;
	}
	dynamicColorController.innerHTML = `:root {${CSS}}`;
};

export const updateDynamicColorFromCover = () => {
	const dom = document.querySelector(".m-pinfo .j-cover");
	if (!dom) return;

	const canvas = document.createElement('canvas');
	canvas.width = 48;
	canvas.height = 48;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(dom, 0, 0, 48, 48);
    const data = ctx.getImageData(0, 0, 48, 48).data;
    const pixels = [];
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a < 255) continue; // Skip transparent pixels
        const argb = ((a << 24) | (r << 16) | (g << 8) | b) >>> 0;
        pixels.push(argb);
    }

	const quantizedColors = QuantizerCelebi.quantize(pixels, 128);
	const ranked = Score.score(quantizedColors);
	const top = ranked[0];

	window.mdCoverDominantColor = top;
	document.body.dispatchEvent(new CustomEvent('md-dominant-color-change'));

	updateDynamicTheme();
}

export const updateDynamicColorFromBGEnhanced = () => {
	const dom = document.querySelector(".BGEnhanced-BackgoundDom .background img");
	if (!dom) return;

	const canvas = document.createElement('canvas');
	let width = dom.naturalWidth;
	let height = dom.naturalHeight;
	if (width > 60 || height > 60) {
		const ratio = width / height;
		if (ratio > 1) {
			width = 60;
			height = 60 / ratio;
		} else {
			width = 60 * ratio;
			height = 60;
		}
	}
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(dom, 0, 0, width, height);
    const data = ctx.getImageData(0, 0, width, height).data;
    const pixels = [];
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a < 255) continue; // Skip transparent pixels
        const argb = ((a << 24) | (r << 16) | (g << 8) | b) >>> 0;
        pixels.push(argb);
    }

	const quantizedColors = QuantizerCelebi.quantize(pixels, 128);
	const ranked = Score.score(quantizedColors);
	const top = ranked[0];

	window.mdBGEnhancedDominantColor = top;
	document.body.dispatchEvent(new CustomEvent('md-dominant-color-change'));

	updateDynamicTheme();
}
