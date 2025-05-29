import { setLanguage } from './languages.js';
import { ids, BIG_TEXT, DEFAULT_TEXT } from '../index.js';

// Apply graphics on/off
const applyGraphics = (): void => {
	let graphicsSetting: string | null = localStorage.getItem('graphics');

	if (!graphicsSetting) {
		localStorage.setItem('graphics', 'on');
		graphicsSetting = 'on';
	}

	const gradientsContainer = document.querySelector('.gradients-container') as HTMLElement | null;
	const videoBackground = document.querySelector('#video-background') as HTMLElement | null;

	if (graphicsSetting === 'on') {
		if (gradientsContainer) gradientsContainer.style.display = 'block';
		if (videoBackground) videoBackground.style.display = 'none';
	} else {
		if (gradientsContainer) gradientsContainer.style.display = 'none';
		if (videoBackground) videoBackground.style.display = 'none';
	}
};

// Set text size
const applyTextSize = (): void => {
	if (localStorage.getItem('bigText') === 'on') {
		document.documentElement.style.fontSize = BIG_TEXT;
	} else {
		document.documentElement.style.fontSize = DEFAULT_TEXT;
	}
};

// Apply the settings from the local storage
export const applySettings = async (): Promise<void> => {
	applyGraphics();
	applyTextSize();
	const lang: string = localStorage.getItem('language') || 'en';
	await setLanguage(lang);
};
