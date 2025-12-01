export const injectCSS = (css) => {
	const style = document.createElement('style');
	style.innerHTML = css;
	document.head.appendChild(style);
}

export const injectHTML = (type, html, parent, fun = (dom) => {}) => {
	const dom = document.createElement(type);
	dom.innerHTML = html;
	fun.call(this, dom);

	parent.appendChild(dom);
	return dom;
}

export const waitForElement = (selector, fun) => {
	const selectors = selector.split(',');
	let done = true;
	for (const s of selectors) {
		if (!document.querySelector(s)) {
			done = false;
		}
	}
	if (done) {
		for (const s of selectors) {
			fun.call(this, document.querySelector(s));
		}
		return;
	}
	let interval = setInterval(() => {
		let done = true;
		for (const s of selectors) {
			if (!document.querySelector(s)) {
				done = false;
			}
		}
		if (done) {
			clearInterval(interval);
			for (const s of selectors) {
				fun.call(this, document.querySelector(s));
			}
		}
	}, 100);
}

export const waitForElementAsync = async (selector) => {
	if (document.querySelector(selector)) {
		return document.querySelector(selector);
	}
    // Assuming betterncm is available globally
	return await betterncm.utils.waitForElement(selector);
}

export const makeToast = (html, duration = 1000) => {
	let noIntroAnimation = false;
	const existingToast = document.querySelector('.md-toast');
	if (existingToast) {
		noIntroAnimation = true;
		existingToast.remove();
	}
	const toast = document.createElement('div');
	toast.classList.add('md-toast', 'u-result', 'j-tips');
	toast.innerHTML = `
		<div class="wrap">
			<div class="inner j-flag" style="${ noIntroAnimation ? 'animation-duration: 0s;' : ''}">
				${html}
			</div>
		</div>
	`;
	document.body.appendChild(toast);
	setTimeout(() => {
		toast.classList.add('z-hide');
		const inner = toast.querySelector('.inner');
		if(inner) inner.style = '';
	}, duration);
	setTimeout(() => {
        if (toast.parentNode) {
		    document.body.removeChild(toast);
        }
	}, duration + 500);
}
