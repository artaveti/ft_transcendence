import { navigateTo } from "../index.js";
import { updateTextForElem } from "../utils/languages.js";
import { validateUsername } from "../utils/validateInput.js";

export function signIn(): void {
    // Get the form elements from the HTML
    const usernameElem = document.getElementById("username") as HTMLInputElement;
    const passwordElem = document.getElementById("password") as HTMLInputElement;
    const usernameErrorElem = document.getElementById("username-error") as HTMLElement;
    const passwordErrorElem = document.getElementById("password-error") as HTMLElement;
    const signInButton = document.querySelector("#sign-in-button") as HTMLButtonElement;
    const containerLogin = document.querySelector('.container-login') as HTMLElement;

    // Apply Tailwind classes
    usernameElem.classList.add('input-field');
    passwordElem.classList.add('input-field');
    usernameErrorElem.classList.add('input-error', 'hidden');
    passwordErrorElem.classList.add('input-error', 'hidden');
    signInButton.classList.add('button-primary');

    /**
     * Validates the password field
     */
    const validatePassword = (passwordElem: HTMLInputElement, passwordErrorElem: HTMLElement): boolean => {
        const password = passwordElem.value;
        if (password === '') {
            updateTextForElem(passwordErrorElem, 'password-empty-error');
            passwordErrorElem.classList.remove('hidden');
            passwordElem.classList.add('border-red-500');
            return false;
        } else {
            passwordErrorElem.classList.add('hidden');
            passwordElem.classList.remove('border-red-500');
            return true;
        }
    };

    /**
     * Attach blur event listeners for validation
     */
    usernameElem.addEventListener("blur", () => {
        const isValid = validateUsername(usernameElem, usernameErrorElem);
        if (!isValid) {
            usernameElem.classList.add('border-red-500');
            usernameErrorElem.classList.remove('hidden');
        } else {
            usernameElem.classList.remove('border-red-500');
            usernameErrorElem.classList.add('hidden');
        }
    });

    passwordElem.addEventListener("blur", () => validatePassword(passwordElem, passwordErrorElem));

    /**
     * Add event listener for the submit button
     */
    signInButton.addEventListener("click", async (e: Event) => {
        e.preventDefault();

        // Validate inputs
        const usernameValid = validateUsername(usernameElem, usernameErrorElem);
        const passwordValid = validatePassword(passwordElem, passwordErrorElem);

        if (!usernameValid || !passwordValid) return;

        const username = usernameElem.value;
        const password = passwordElem.value;

        try {
            // Perform the login request
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 400) {
                const responseData = await response.json();
                updateTextForElem(usernameErrorElem, responseData.error[0]);
                updateTextForElem(passwordErrorElem, responseData.error[0]);
                usernameErrorElem.classList.remove('hidden');
                passwordErrorElem.classList.remove('hidden');
                return;
            }

            if (response.status === 200) {
                const result = await response.json();

                if (result.twofa_required && result.temp_token) {
                    // Save the temp_token in sessionStorage or localStorage
                    sessionStorage.setItem("temp_token", result.temp_token);
                    navigateTo("/verify2fa");
                } else if (result.token) {
                    // Save the final JWT token (can be used in Authorization headers later)
                    localStorage.setItem("auth_token", result.token);
                    navigateTo("/setup2fa");
                } else {
                    containerLogin.innerHTML = `
                        <div class="error-message">
                            <h5 id="failure-message">
                                Login succeeded, but server response was unexpected
                            </h5>
                        </div>
                    `;
                }
                return;
            }

            containerLogin.innerHTML = `
                <div class="error-message">
                    <h5 id="failure-message">
                        An error occurred in the server
                    </h5>
                </div>
            `;
            updateTextForElem(document.getElementById('failure-message') as HTMLElement, 'sign-up-failure');

        } catch (error) {
            console.error("An error occurred during sign-in:", error);
            containerLogin.innerHTML = `
                <div class="error-message">
                    <h5 id="failure-message">
                        Unable to connect to the server.
                    </h5>
                </div>
            `;
        }
    });
}
