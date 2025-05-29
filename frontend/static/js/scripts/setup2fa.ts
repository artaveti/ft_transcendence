import { navigateTo } from "../index.js";

export function setup2FA(): void {
  const qrBtn = document.getElementById("generate-qr-button") as HTMLButtonElement | null;
  const enableBtn = document.getElementById("enable-2fa-button") as HTMLButtonElement | null;
  const qrImg = document.getElementById("qr-code") as HTMLImageElement | null;
  const resultElem = document.getElementById("enable-result") as HTMLParagraphElement | null;

  // Check if elements exist
  if (!qrBtn || !enableBtn || !qrImg || !resultElem) {
    console.error("One or more required elements not found.");
    return;
  }

  // Event listener for generating the QR code
  qrBtn.addEventListener("click", async (e: MouseEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("temp_token");

    try {
      const res = await fetch("/api/setup-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = await res.json();
      if (data.qrCode && qrImg) {
        qrImg.src = data.qrCode;
        qrImg.style.display = "block";
      }
    } catch (error) {
      console.error("Failed to fetch QR Code:", error);
    }
  });

  // Event listener for enabling 2FA
  enableBtn.addEventListener("click", async (e: MouseEvent) => {
    e.preventDefault();

    const codeInput = document.getElementById("code-input") as HTMLInputElement | null;
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("temp_token");

    if (!codeInput) {
      console.error("Code input element not found.");
      return;
    }

    const code = codeInput.value;

    try {
      const res = await fetch("/api/enable-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, code })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("temp_token");
        navigateTo("/signin");
      } else if (resultElem) {
        resultElem.textContent = data.error?.[0] || "Failed to enable 2FA.";
      }
    } catch (error) {
      console.error("Failed to enable 2FA:", error);
      if (resultElem) {
        resultElem.textContent = "An error occurred during 2FA setup.";
      }
    }
  });
}
