import AbstractView from "./AbstractView.js";

export default class GamesView extends AbstractView {
	constructor() {
		super();
		this.setTitle("quanta - games");
	}

	async getHtml(): Promise<string> {
		return (await fetch("static/html/games.html")).text();
	} //old but gold
	
	
}
