import { BASE_URL, navigateTo } from '../index.js'; // If index.js is not yet TypeScript, keep `.js`
import { authFetch } from './authFetch.js'; // No extension needed when importing a TS module

// Function to check if the user is connected (authenticated)
export const isUserConnected = async (): Promise<boolean> => {
  try {
    const response = await authFetch(`${BASE_URL}/api/profile`);
    return response.status === 200;
  } catch (err) {
    return false; // Token is missing/invalid/expired
  }
};

// Function to attach event listeners to the links
export const attachEventListenersToLinks = (): void => {
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-link]');

  links.forEach((link) => {
    link.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      navigateTo(link.href);
    });
  });
};
