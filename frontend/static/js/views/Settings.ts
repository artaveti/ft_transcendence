import AbstractView from "./AbstractView.js";
import { settings } from "../scripts/settings.js";


export default class SettingsView extends AbstractView {
	constructor() {
		super();
		this.setTitle("quanta - settings");
	}

	getHtml(): Promise<string> {
		return fetch("static/html/settings.html").then((res) => res.text());
	}
	loadJS(): void {
		settings();
	}

	stopJS(): void {

	}
}