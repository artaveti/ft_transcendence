

import { navigateTo } from "../index.js";

export function verify2FA(): void {
  const verifyButton = document.getElementById("verify-button") as HTMLButtonElement | null;
  const resultElem = document.getElementById("verify-result") as HTMLParagraphElement | null;

  if (!verifyButton || !resultElem) {
    console.error("Verify button or result element not found.");
    return;
  }

  verifyButton.addEventListener("click", async (e: MouseEvent) => {
    e.preventDefault();

    const codeInput = document.getElementById("code-input") as HTMLInputElement | null;
    const temp_token = sessionStorage.getItem("temp_token");

    if (!codeInput) {
      console.error("Code input not found.");
      return;
    }

    const code = codeInput.value;

    try {
      const res = await fetch("/api/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temp_token, code })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("auth_token", data.token);

        // Validate token before navigating
        const profileRes = await fetch("/api/profile", {
          headers: {
            "Authorization": `Bearer ${data.token}`
          }
        });

        if (profileRes.status === 200) {
          navigateTo("/profile");
        } else if (resultElem) {
          resultElem.textContent = "Token valid, but profile access failed.";
        }
      }
    } catch (error) {
      console.error("Verification failed:", error);
      if (resultElem) {
        resultElem.textContent = "Verification failed. Please try again.";
      }
    }
  });
}
