import AbstractView from "./AbstractView.js";
import { BASE_URL } from "../index.js";

export default class extends AbstractView {
   constructor() {
       super();
       this.setTitle("quanta - not found");
   }

   // async getHtml() {
   //     return (await fetch(`${BASE_URL}/static/html/notFound.html`)).text();
   // }

   async getHtml(): Promise<string> {
       return `
           <h1>404 - Not Found</h1>
           <p>The page you’re looking for doesn't exist.</p>
       `;
   }
}
