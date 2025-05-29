import AbstractView from "./AbstractView.js"; // Keep .js if AbstractView isn't yet converted
import { googleSignIn } from "../scripts/googleSignIn.js";

declare global {
  interface Window {
    google: typeof google;
    handleGoogleLogin: (response: google.accounts.id.CredentialResponse) => void;
  }

  namespace google {
    namespace accounts {
      namespace id {
        function initialize(config: {
          client_id: string;
          callback: (response: CredentialResponse) => void;
        }): void;

        function renderButton(
          parent: HTMLElement,
          options: {
            theme: string;
            size: string;
            text: string;
            shape: string;
          }
        ): void;

        interface CredentialResponse {
          credential: string;
          select_by: string;
        }
      }
    }
  }
}


export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("quanta - google sign in");
  }

  async getHtml(): Promise<string> {
    const res = await fetch("static/html/googleSignIn.html");
    return res.text();
  }

  loadJS(): void {
    // Load the Google Sign-In script if it's not already loaded
    if (window.google && google.accounts && google.accounts.id) {
      googleSignIn(); // SDK already loaded
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => googleSignIn();
      document.head.appendChild(script);
    }
  }

  stopJS(): void {
    // Optional: clean up if needed when leaving view
  }
}
