import AbstractView from "./AbstractView.js";
import { signUp } from "../scripts/signUp.js";

export default class SignUpView extends AbstractView {
    constructor() {
        super();
        this.setTitle("quanta - sign up");
    }

    async getHtml(): Promise<string> {
        const res = await fetch("/static/html/signUp.html");
        if (!res.ok) {
            throw new Error(`Failed to load view: ${res.statusText}`);
        }
        return res.text();
    }

    loadJS(): any {
        requestAnimationFrame(() => {
            signUp();
        });
        //  signUp(); // Await the execution
    }

    stopJS(): void {
    }
}
