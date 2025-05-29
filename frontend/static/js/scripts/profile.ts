import { navigateTo } from "../index.js";
import { BASE_URL } from "../index.js";
import { authFetch } from "../utils/authFetch.js";

interface User {
  id: string;
  username: string;
  email: string;
}

interface ProfileResponse {
  user: User;
}

export async function profile(): Promise<void> {
  async function renderLoggingInfo(): Promise<void> {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigateTo('/signin');
      return;
    }

    const response = await fetch(`${BASE_URL}/api/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status !== 200) {
      navigateTo('/signin');
      return;
    }

    const responseData: ProfileResponse = await response.json();
    const user = responseData.user;

    localStorage.setItem('user_id', user.id);

    const usernameElem = document.getElementById('username-name') as HTMLElement;
    if (usernameElem) {
      usernameElem.innerText = user.username;
    }

    const emailElem = document.getElementById('username-email') as HTMLElement;
    if (emailElem) {
      emailElem.innerText = user.email;
    }

    const avatarElem = document.getElementById('avatar') as HTMLImageElement;
    if (avatarElem) {
      const responseAvatar = await authFetch(`${BASE_URL}/api/user_avatar`);
  
      if (responseAvatar.status !== 200) {
        avatarElem.src = 'static/assets/images/profile_pic_transparent.png';
      } else {
        const blob = await responseAvatar.blob();
        const url = URL.createObjectURL(blob);
        avatarElem.src = url;
      }
    }

    const profilePageElem = document.getElementById('profile-page') as HTMLElement;
    if (profilePageElem) {
      profilePageElem.style.display = 'flex';
    }
  }

  const logoutButton = document.querySelector('#logout-button') as HTMLElement;
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await authFetch(`${BASE_URL}/api/logout`, { method: 'POST' });

      // Clear all stored settings
      const keysToRemove = [
        'auth_token', 'user_id',  
        'pongColors', 'pongUsernames', 'pongKeybinds',
        'gamemode', 'pongGamestyle'
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));

      navigateTo('/signin');
    });
  }

  await renderLoggingInfo();
}
