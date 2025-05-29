import AbstractView from "./AbstractView.js";
import { verify2FA } from "../scripts/verify2fa.js";

export default class Verify2FAView extends AbstractView {
  constructor() {
    super();
    this.setTitle("quanta - verify 2FA");
  }

  getHtml(): Promise<string> {
    return fetch("static/html/verify2fa.html").then((res) => res.text());
  }

  loadJS(): void {
    verify2FA();
  }

  stopJS(): void {
  }
}
