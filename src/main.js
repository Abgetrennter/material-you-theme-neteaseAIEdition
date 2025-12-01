import './styles/main.scss';
import './styles/dynamic-theme.scss'
import './styles/compatibility.scss'
import './components/Ripple/index.js'
import { getSetting, setSetting } from './utils/settings.js';
import { initSettings, hookContextMenu, setupThemeListener } from './core/dom/nativeStyles.js';
import { applyScheme } from './core/theme/applyScheme.js';
import { updateDynamicTheme as realUpdateDynamicTheme } from './core/theme/dynamicTheme.js';
import { initObservers } from './core/plugin/observers.js';


const migrateSettings = () => {
	if (getSetting('scheme') == 'dynamic-auto') {
		setSetting('scheme', 'dynamic-default-auto');
	}
}
migrateSettings();

// Apply initial theme
realUpdateDynamicTheme();

plugin.onLoad(async (p) => {
    // Initialize settings
	initSettings();
    
    // Apply initial scheme
	applyScheme(getSetting('scheme', 'dynamic-default-auto'));

	document.body.classList.add('material-you-theme');

	if (loadedPlugins['BGEnhanced']) {
		document.body.classList.add('md-has-background');
	}

    // Hook native context menu
    hookContextMenu();

    // Setup theme listener
    setupThemeListener();

    // Initialize observers
    initObservers();
});

plugin.onConfig((tools) => {
	return dom("div", {},
		dom("span", { innerHTML: "打开设置面板 " , style: { fontSize: "18px" } }),
		tools.makeBtn("打开", async () => {
			document.querySelector("#md-theme-setting-btn:not(.active)").click();
		})
	);
});
