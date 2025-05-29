import AbstractView from "./AbstractView.js";
import { pongStatistics } from "../scripts/pongStatistics.js";



export default class PongStatisticsView extends AbstractView  {
	constructor() {
		super();
		this.setTitle("quanta - pong statistics");
	}

	getHtml(): Promise<string> {
		return fetch("static/html/pongStatistics.html").then((res) => res.text());
	}

	loadJS(): void {
		pongStatistics();
	}
}
