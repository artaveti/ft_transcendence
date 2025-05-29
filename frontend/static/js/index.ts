// ------------------------------- IMPORT VIEWS -------------------------------
//@ts-ignore
import { createStarsAndComets, removeStarsAndComets } from './visual/starfield.js';

import Home from "./views/Home.js";
import Pong from "./views/Pong.js";
import PongMenu from "./views/PongMenu.js";
import Settings from "./views/Settings.js";
import NotFound from "./views/NotFound.js";
import Games from "./views/Games.js";
import Profile from "./views/Profile.js";
import SignIn from "./views/SignIn.js";
import SignUp from "./views/SignUp.js";
import EditProfile from "./views/EditProfile.js";
import Friends from "./views/Friends.js";
import PongStatistics from "./views/PongStatistics.js";
//@ts-ignore
import Setup2FA from "./views/Setup2FA.js";
//@ts-ignore
import Verify2FA from "./views/Verify2FA.js";
import GoogleSignIn from "./views/GoogleSignIn.js";


// ------------------------------- IMPORT VISUAL EFFECTS -------------------------------
import { animateLetters, initLoadTransition, initInteractiveBubble } from './visual/effects.js';

// ------------------------------- IMPORT UTILS ---------------------------------
import { updateTexts } from "./utils/languages.js";
import { applySettings } from "./utils/applySettings.js";
import { attachEventListenersToLinks } from "./utils/utils.js";

// ------------------------------- CONFIGURE GLOBAL VARIABLES -------------------------------
export const BASE_URL: string = "";
export const BIG_TEXT: string = '20px';
export const DEFAULT_TEXT: string = '16px';
export const ids: Record<string, number> = {};

interface View {
    getHtml: () => Promise<string>;
    loadJS: () => void;
    stopJS: () => void;
    cleanUpEventListeners: () => void;
}

// ------------------------------- ROUTES -------------------------------
const routes: { path: string, view: new () => View }[] = [
	{ path: "/", view: Home },
	{ path: "/404", view: NotFound },
    { path: "/pong", view: Pong },
    { path: "/profile", view: Profile },
    { path: "/signin", view: SignIn },
    { path: "/signup", view: SignUp },
     { path: "/games", view: Games },
     { path: "/pongMenu", view: PongMenu },
     { path: "/pong-statistics", view: PongStatistics },
     { path: "/friends", view: Friends },
     { path: "/edit-profile", view: EditProfile },
     { path: "/settings", view: Settings },
     { path: "/setup2fa", view: Setup2FA },
	{ path: "/verify2fa", view: Verify2FA },
	{ path: "/login-google", view: GoogleSignIn }




];

// ------------------------------- GLOBAL VIEW REFERENCE -------------------------------
let view: View | null = null;

//
// ============================== TAILWIND REFRESH ==============================
//

function updateGraphicsBackground() {
  const graphicsSetting = localStorage.getItem('graphics') || 'on';
  if (graphicsSetting === 'on') {
    createStarsAndComets();
  } else {
    removeStarsAndComets();
  }
}

function refreshTailwind() {
    const elements = document.querySelectorAll("#app *");
    elements.forEach((el) => {
        const currentClasses = el.className;
        el.className = currentClasses;
    });
}

//
// ============================== MODAL CLEANUP ==============================
//
function hideModals() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
}

//
// ============================== ROUTER LOGIC ==============================
//
const router = async (): Promise<void> => {
    let match = routes.find(route => route.path === location.pathname);

    // ✅ 404 Fallback
    if (!match) {
        console.warn(`Route not found: ${location.pathname}`);
        match = { path: "/404", view: NotFound };
    }

    // ✅ Cleanup existing view if it exists
    if (view) {
        view.cleanUpEventListeners();
        view.stopJS();
        hideModals();
    }

    // ➡️ Clear Canvas if Pong is loaded
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }

    // ✅ Instantiate the new view
    view = new match.view();

    // ✅ Find the #app container and inject HTML
    const appDiv = document.querySelector("#app");
    if (appDiv) {
        appDiv.innerHTML = '';
        appDiv.innerHTML = await view.getHtml();

        // ✅ Load scripts and event listeners
        view.loadJS();
        attachEventListenersToLinks();
        updateTexts();
        animateLetters();

        // ✅ Refresh Tailwind
        refreshTailwind();
    }
};

//
// ============================== NAVIGATION FUNCTION ==============================
//
export const navigateTo = (url: string): void => {
	history.pushState(null, "", url);
	router();
};

//
// ============================== PAGE LOAD LISTENER ==============================
//
document.addEventListener("DOMContentLoaded", async () => {
	initLoadTransition();
	initInteractiveBubble();
	await applySettings();
    updateGraphicsBackground(); // 👈 Add this
	router();
});

//
// ============================== POPSTATE LISTENER ==============================
//
window.addEventListener("popstate", router);
