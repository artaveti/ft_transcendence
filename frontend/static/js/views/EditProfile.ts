import AbstractView from "./AbstractView.js";
import { editProfile /*, eventListeners*/ } from "../scripts/editProfile.js";

export default class EditProfileView extends AbstractView {
  constructor() {
    super();
    this.setTitle("quanta - edit profile");
  }

  /** Fetches the static HTML fragment and returns its text. */
  async getHtml(): Promise<string> {
    const res = await fetch("static/html/editProfile.html");
    return res.text();
  }

  /** Kick-off the page-specific JS (form bindings, avatar preview, etc.). */
  loadJS(): void {
    editProfile();
  }

  /** No animation loop here, so nothing to stop. */
  stopJS(): void {}

  // Uncomment if exposed an `eventListeners` map from editProfile.ts
  /*
  cleanUpEventListeners(): void {
    for (const [event, listener] of Object.entries(eventListeners)) {
      document.removeEventListener(event, listener as EventListener);
    }
  }
  */
}
