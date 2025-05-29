import AbstractView from "./AbstractView.js";
import { setup2FA } from "../scripts/setup2fa.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("quanta - setup 2FA");
  }

  async getHtml() {
    return (await fetch("static/html/setup2fa.html")).text();
  }

  loadJS() {
    setup2FA();
  }

  stopJS() {}
}
