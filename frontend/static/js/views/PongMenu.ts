
import AbstractView from "./AbstractView.js";
import { PongMenu, eventListeners } from "../scripts/pongMenu.js";


type EventMap = Record<string, EventListener>;

export default class PongMenuView extends AbstractView  {
	constructor() {
		super();
		this.setTitle("pong menu");
	}

	getHtml(): Promise<string> {
		return fetch("static/html/pongMenu.html").then((res) => res.text());
	}

	loadJS(): void {
		var pongMenu = new PongMenu();
	}

	stopJS(): void {
	}

	cleanUpEventListeners(): void {
		for (const [event, listener] of Object.entries(eventListeners as EventMap)) {
			document.removeEventListener(event, listener);
		}
	}
}
