export default class AbstractView {
	constructor() {}

	setTitle(title: string): void {
		document.title = title;
	}

	async getHtml(): Promise<string> {
		return "";
	}

	loadJS(): void {}

	stopJS(): void {}

	cleanUpEventListeners(): void {}
}
