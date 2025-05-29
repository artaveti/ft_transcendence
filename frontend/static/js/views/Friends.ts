import AbstractView from "./AbstractView.js";
import { friends } from "../scripts/friends.js";

export default class FriendsView extends AbstractView {
	constructor() {
		super();
		this.setTitle("quanta - friends");
	}

	async getHtml(): Promise<string> {
		return (await fetch("static/html/friends.html")).text();
	}

	loadJS(): void {
		friends();
	}
}
