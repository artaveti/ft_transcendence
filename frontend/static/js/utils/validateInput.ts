
import { updateTextForElem } from './languages.js';

// Типизация для input и span/label элементов
type InputElement = HTMLInputElement;
type ErrorElement = HTMLElement;

// Validates the username, returns true if it is valid
export const validateUsername = (
	usernameElem: InputElement,
	usernameErrorElem: ErrorElement
): boolean => {
	const username = usernameElem.value;
	if (username === '') {
		updateTextForElem(usernameErrorElem, 'username-empty-error');
		return false;
	} else {
		usernameErrorElem.textContent = '\u00A0';
		return true;
	}
};

export const validateEmail = (
	emailElem: InputElement,
	emailErrorElem: ErrorElement
): boolean => {
	const email = emailElem.value;
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (email === '') {
		updateTextForElem(emailErrorElem, 'e-mail-empty-error');
		return false;
	} else if (!emailPattern.test(email)) {
		updateTextForElem(emailErrorElem, 'e-mail-invalid-error');
		return false;
	} else {
		emailErrorElem.textContent = '\u00A0';
		return true;
	}
};

export const validatePassword = (
	passwordElem: InputElement,
	passwordErrorElem: ErrorElement
): boolean => {
	const password = passwordElem.value;

	if (password === '') {
		updateTextForElem(passwordErrorElem, 'password-empty-error');
		return false;
	} else if (password.length < 9) {
		updateTextForElem(passwordErrorElem, 'password-short-error');
		return false;
	} else if (password.length > 20) {
		updateTextForElem(passwordErrorElem, 'password-long-error');
		return false;
	} else if (!/[A-Z]/.test(password)) {
		updateTextForElem(passwordErrorElem, 'password-uppercase-error');
		return false;
	} else if (!/[a-z]/.test(password)) {
		updateTextForElem(passwordErrorElem, 'password-lowercase-error');
		return false;
	} else if (!/\d/.test(password)) {
		updateTextForElem(passwordErrorElem, 'password-number-error');
		return false;
	} else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
		updateTextForElem(passwordErrorElem, 'password-special-error');
		return false;
	} else {
		passwordErrorElem.textContent = '\u00A0';
		return true;
	}
};
