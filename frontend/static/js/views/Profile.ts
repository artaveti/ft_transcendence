import AbstractView from "./AbstractView.js";
import { profile } from "../scripts/profile.js";


export default class ProfileView extends AbstractView {
	constructor() {
		super();
		this.setTitle("quanta - profile");
	}

	// async getHtml(): Promise<string> {
	// 	return fetch("static/html/profile.html").then((res) => res.text());
	// }
	async getHtml(): Promise<string> {
		const res = await fetch("static/html/profile.html");
		return res.text();
	}
	async loadJS(): Promise<void> {
		await profile();
	}

	stopJS(): void {
	}
}
