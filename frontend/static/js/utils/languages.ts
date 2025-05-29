

// Switch language setting
let translations: Record<string, string> = {};

// Загрузка переводов из JSON-файла
async function loadTranslations(language: string): Promise<Record<string, string>> {
	const response = await fetch(`static/languages/${language}.json`);
	const translations = await response.json();
	return translations;
}

// Установить язык и обновить текст на странице
export async function setLanguage(language: string): Promise<void> {
	translations = await loadTranslations(language);
	updateTexts();
}

// Обновить все элементы с data-translate
export function updateTexts(): void {
	document.querySelectorAll<HTMLElement>('[data-translate]').forEach(element => {
		const key = element.getAttribute('data-translate');
		if (!key || !(key in translations)) return;

		if (element.hasAttribute('placeholder')) {
			element.setAttribute('placeholder', translations[key]);
		} else {
			element.textContent = translations[key];
		}
	});
}

// Обновить текст для одного элемента
export function updateTextForElem(elem: HTMLElement, key: string): void {
	if (key in translations) {
		elem.textContent = translations[key];
	}
}

// Получить текст по ключу
export function getText(key: string): string | undefined {
	return translations[key];
}
