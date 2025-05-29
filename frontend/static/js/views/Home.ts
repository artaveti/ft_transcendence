import AbstractView from "./AbstractView.js";
// import { refreshTailwind } from "../refreshTailwind.js"; 

export default class HomeView extends AbstractView {
  constructor() {
    super();
    this.setTitle("quanta - home");
  }

  async getHtml(): Promise<string> {
    const pageContent = await (await fetch("/static/html/home.html")).text();
    const appDiv = document.querySelector("#app");
    if (appDiv) {
      appDiv.innerHTML = pageContent;
    }

    return pageContent;
  }
}
