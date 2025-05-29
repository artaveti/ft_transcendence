import { BASE_URL } from '../index.js';
import { updateTextForElem } from '../utils/languages.js';
import { navigateTo } from '../index.js';
import { validateUsername, validateEmail, validatePassword } from '../utils/validateInput.js';

// Function that will be called when the view is loaded
export function signUp(): void {
    // Get the form elements from the HTML
    const usernameElem = document.getElementById('username') as HTMLInputElement;
    const emailElem = document.getElementById('email') as HTMLInputElement;
    const passwordElem = document.getElementById('password') as HTMLInputElement;

    const usernameErrorElem = document.getElementById('username-error') as HTMLElement;
    const emailErrorElem = document.getElementById('email-error') as HTMLElement;
    const passwordErrorElem = document.getElementById('password-error') as HTMLElement;

    usernameElem.classList.add('border', 'border-gray-300', 'rounded', 'p-2', 'w-full');
    emailElem.classList.add('border', 'border-gray-300', 'rounded', 'p-2', 'w-full');
    passwordElem.classList.add('border', 'border-gray-300', 'rounded', 'p-2', 'w-full');
    usernameErrorElem.classList.add('text-red-500', 'text-sm', 'mt-1');
    emailErrorElem.classList.add('text-red-500', 'text-sm', 'mt-1');
    passwordErrorElem.classList.add('text-red-500', 'text-sm', 'mt-1');

    // Add event listeners for when the user leaves the input fields
    usernameElem.addEventListener('blur', () => {
        const isValid = validateUsername(usernameElem, usernameErrorElem);
        if (!isValid) {
            usernameElem.classList.add('border-red-500');
            usernameErrorElem.classList.remove('hidden');
        } else {
            usernameElem.classList.remove('border-red-500');
            usernameErrorElem.classList.add('hidden');
        }
    });

    emailElem.addEventListener('blur', () => {
        const isValid = validateEmail(emailElem, emailErrorElem);
        if (!isValid) {
            emailElem.classList.add('border-red-500');
            emailErrorElem.classList.remove('hidden');
        } else {
            emailElem.classList.remove('border-red-500');
            emailErrorElem.classList.add('hidden');
        }
    });

    passwordElem.addEventListener('blur', () => {
        const isValid = validatePassword(passwordElem, passwordErrorElem);
        if (!isValid) {
            passwordElem.classList.add('border-red-500');
            passwordErrorElem.classList.remove('hidden');
        } else {
            passwordElem.classList.remove('border-red-500');
            passwordErrorElem.classList.add('hidden');
        }
    });

    // Add event listener for the submit button
    const signUpButtonElem = document.getElementById('sign-up-button') as HTMLButtonElement;
    signUpButtonElem.classList.add('bg-blue-500', 'hover:bg-blue-600', 'text-white', 'p-2', 'rounded', 'w-full', 'mt-4');
    signUpButtonElem.addEventListener('click', submitForm);

    async function submitForm(e: Event): Promise<void> {
        // Prevent the default behavior of the form
        e.preventDefault();

        // Make sure that all the fields are valid (at least front-end-wise)
        const usernameValid = validateUsername(usernameElem, usernameErrorElem);
        const emailValid = validateEmail(emailElem, emailErrorElem);
        const passwordValid = validatePassword(passwordElem, passwordErrorElem);

        if (!usernameValid || !emailValid || !passwordValid) return;

        const username = usernameElem.value;
        const email = emailElem.value;
        const password = passwordElem.value;

        const data = {
            username,
            email,
            password,
        };

        try {
            // Send the data to the server
            const response = await fetch(`${BASE_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const containerLogin = document.querySelector('.container-login') as HTMLElement;

            if (response.status === 400) {
                const responseData = await response.json();
                if (responseData.username) {
                    updateTextForElem(usernameErrorElem, responseData.username[0]);
                    usernameErrorElem.classList.remove('hidden');
                }
                if (responseData.email) {
                    updateTextForElem(emailErrorElem, responseData.email[0]);
                    emailErrorElem.classList.remove('hidden');
                }
                if (responseData.password) {
                    updateTextForElem(passwordErrorElem, responseData.password[0]);
                    passwordErrorElem.classList.remove('hidden');
                }
            }
            else if (response.status === 200) {
                if (containerLogin) {
                    containerLogin.innerHTML = `
                        <div class="text-green-500 text-center mt-4">
                            <h1 id="success-message">Sign-up successful! Redirecting to sign-in...</h1>
                        </div>
                    `;
                    updateTextForElem(document.getElementById('success-message') as HTMLElement, 'sign-up-success');
                } else {
                    alert('Sign-up successful! Redirecting to sign-in...');
                }
            
                setTimeout(() => {
                    navigateTo('/signin');
                }, 1000);
                }                
            else {
                const responseData = await response.json();
                containerLogin.innerHTML = `
                    <div class="text-red-500 text-center mt-4">
                        <h1 id="failure-message">An error occurred in the server</h1>
                        <p>${responseData.error}</p>
                    </div>
                `;
                updateTextForElem(document.getElementById('failure-message') as HTMLElement, 'sign-up-failure');
            }
        } catch (error) {
            console.error("An error occurred during sign-up:", error);
        }
    }
}
