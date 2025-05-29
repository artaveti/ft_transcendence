
import { updateTextForElem } from "../utils/languages.js";
import { navigateTo } from '../index.js';
import { BASE_URL } from '../index.js';
import { isUserConnected } from "../utils/utils.js";
import { validateUsername, validateEmail, validatePassword } from "../utils/validateInput.js";
import { authFetch } from "../utils/authFetch.js";

type ProfileChanges = {
  profilePicture: boolean;
  username: boolean;
  email: boolean;
  password: boolean;
};

export async function editProfile(): Promise<void> {
  if (!(await isUserConnected())) {
    
    navigateTo('/signin');
    return;
  }

  const changes: ProfileChanges = {
    profilePicture: false,
    username: false,
    email: false,
    password: false
  };

  // DOM elements with null checks
  const avatarElem = document.getElementById('avatar') as HTMLImageElement;
  const avatarInputElem = document.getElementById('avatar-input') as HTMLInputElement;
  const usernameElem = document.getElementById('username') as HTMLInputElement;
  const emailElem = document.getElementById('email') as HTMLInputElement;
  const passwordElem = document.getElementById('password') as HTMLInputElement;

  const usernameErrorElem = document.getElementById('username-error') as HTMLElement;
  const emailErrorElem = document.getElementById('email-error') as HTMLElement;
  const passwordErrorElem = document.getElementById('password-error') as HTMLElement;
  const avatarErrorElem = document.getElementById('avatar-error') as HTMLElement;
  const saveButtonElem = document.getElementById('save-button') as HTMLButtonElement;

  // ⚠️ Added strict null checks:
  if (!avatarElem || !avatarInputElem || !usernameElem || !emailElem || !passwordElem ||
      !usernameErrorElem || !emailErrorElem || !passwordErrorElem || !avatarErrorElem || !saveButtonElem) {
    console.error("One or more required DOM elements not found.");
    return;
  }

  // Event listeners
  usernameElem.addEventListener('blur', () => validateUsername(usernameElem, usernameErrorElem));
  emailElem.addEventListener('blur', () => validateEmail(emailElem, emailErrorElem));
  passwordElem.addEventListener('blur', () => validatePassword(passwordElem, passwordErrorElem));

  avatarInputElem.addEventListener('change', () => {
    changes.profilePicture = true;
    if (validateAvatar()) {
      const avatar = avatarInputElem.files?.[0];
      if (avatar) {
        const url = URL.createObjectURL(avatar);
        avatarElem.src = url;
      }
    }
  });

  usernameElem.addEventListener('change', () => (changes.username = true));
  emailElem.addEventListener('change', () => (changes.email = true));
  passwordElem.addEventListener('change', () => (changes.password = true));

  saveButtonElem.addEventListener('click', submitForm);

  // Fetch current avatar
  const responseAvatar = await authFetch(`${BASE_URL}/api/user_avatar`);
  if (responseAvatar.status !== 200) {
    avatarElem.src = 'static/assets/images/profile_pic_transparent.png';
  } else {
    const blob = await responseAvatar.blob();
    const url = URL.createObjectURL(blob);
    avatarElem.src = url;
  }

  // Fetch current profile info
  const response = await authFetch(`${BASE_URL}/api/profile`);
  if (response.status === 200) {
    const responseData = await response.json();
    const user = responseData.user;
    usernameElem.value = user.username;
    emailElem.value = user.email;
  }

  // Validation function
  function validateAvatar(): boolean {
    const avatar = avatarInputElem.files?.[0];
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

    if (!avatar) {
      updateTextForElem(avatarErrorElem!, 'avatar-empty-error');
      return false;
    }
    if (!allowedExtensions.exec(avatar.name)) {
      updateTextForElem(avatarErrorElem!, 'avatar-invalid-error');
      return false;
    }
    if (avatar.size > 1024 * 1024) {
      updateTextForElem(avatarErrorElem!, 'avatar-size-error');
      return false;
    }
    avatarErrorElem!.textContent = '\u00A0';
    return true;
  }

  // Form submission
  async function submitForm(e: Event): Promise<void> {
    e.preventDefault();

    const hasChanges = Object.values(changes).some(v => v === true);
    if (!hasChanges) return;

    const formData = new FormData();
    let formValid = true;

    if (changes.profilePicture && validateAvatar()) {
      const avatarFile = avatarInputElem.files?.[0];
      if (avatarFile) {
        formData.append('profile_picture', avatarFile);
      }
    } else if (changes.profilePicture) {
      formValid = false;
    }

    if (changes.username && validateUsername(usernameElem, usernameErrorElem)) {
      formData.append('username', usernameElem.value);
    } else if (changes.username) {
      formValid = false;
    }

    if (changes.email && validateEmail(emailElem, emailErrorElem)) {
      formData.append('email', emailElem.value);
    } else if (changes.email) {
      formValid = false;
    }

    if (changes.password && validatePassword(passwordElem, passwordErrorElem)) {
      formData.append('password', passwordElem.value);
    } else if (changes.password) {
      formValid = false;
    }

    if (!formValid) return;

    const response = await authFetch(`${BASE_URL}/api/update_user`, {
      method: 'PUT',
      body: formData
    });

    const containerEdit = document.querySelector('.container-edit') as HTMLElement | null;

    if (response.status === 400) {
      const responseData = await response.json();
      if (responseData.username) updateTextForElem(usernameErrorElem!, responseData.username[0]);
      if (responseData.email) updateTextForElem(emailErrorElem!, responseData.email[0]);
      if (responseData.password) updateTextForElem(passwordErrorElem!, responseData.password[0]);
    } else if (response.status === 200 && containerEdit) {
      containerEdit.innerHTML = `<div class="success text-center">...loading icon...</div>`;
      setTimeout(() => navigateTo('/profile'), 1000);
    } else if (containerEdit) {
      containerEdit.innerHTML = `<div class="error text-center"><h1 id="failure-message">An error occurred in the server</h1></div>`;
      updateTextForElem(document.getElementById('failure-message')!, 'save-failure');
    }
  }
}

