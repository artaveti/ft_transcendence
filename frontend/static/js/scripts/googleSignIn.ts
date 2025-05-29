declare global {
	interface Window {
	  google: typeof google;
	  handleGoogleLogin: (response: google.accounts.id.CredentialResponse) => void;
	}
  
	namespace google {
	  namespace accounts {
		namespace id {
		  function initialize(config: {
			client_id: string;
			callback: (response: CredentialResponse) => void;
		  }): void;
  
		  function renderButton(
			parent: HTMLElement,
			options: {
			  theme: string;
			  size: string;
			  text: string;
			  shape: string;
			}
		  ): void;
  
		  interface CredentialResponse {
			credential: string;
			select_by: string;
		  }
		}
	  }
	}
  }
  
  let finalToken = "";
  
  window.handleGoogleLogin = async function (
	response: google.accounts.id.CredentialResponse
  ): Promise<void> {
	const idToken = response.credential;
  
	const tokenResult = document.getElementById("tokenResult");
	if (tokenResult) {
	  tokenResult.textContent = ""; // "Google ID Token:\n" + idToken;
	}
  
	try {
	  const res = await fetch("/api/google-login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id_token: idToken }),
	  });
  
	  const result = await res.json();
	  const serverResult = document.getElementById("serverResult");
	  if (serverResult) {
		serverResult.textContent = "";
		  //"Backend Response:\n" + JSON.stringify(result, null, 2);
	  }
  
	  if (result.token) {
		finalToken = result.token;
		localStorage.setItem("auth_token", finalToken);
	  } else {
		alert("❌ Login failed or no token received.");
	  }
	} catch (error) {
	  console.error("Login failed", error);
	  alert("Login error. See console.");
	}
  };
  
  export function googleSignIn(): void {
	if (window.google && google.accounts && google.accounts.id) {
	  google.accounts.id.initialize({
		client_id:
		  "533060755960-kfel2q1fm958u6ui38mooe5psojci4tr.apps.googleusercontent.com",
		callback: window.handleGoogleLogin,
	  });
  
	  const signInDiv = document.querySelector<HTMLElement>(".g_id_signin");
	  if (signInDiv) {
		google.accounts.id.renderButton(signInDiv, {
		  theme: "outline",
		  size: "large",
		  text: "sign_in_with",
		  shape: "rectangular",
		});
	  }
	} else {
	  console.error("Google SDK not available");
	}
  
	document
	  .getElementById("getProfileBtn")
	  ?.addEventListener("click", async () => {
		try {
		  const res = await fetch("/api/profile", {
			headers: {
			  Authorization: "Bearer " + finalToken,
			},
		  });
		  const profile = await res.json();
		  const profileResult = document.getElementById("profileResult");
		  if (profileResult) {
			profileResult.textContent =
			  "Protected /api/profile Response:\n" +
			  JSON.stringify(profile, null, 2);
		  }
		} catch (err) {
		  console.error("Error fetching profile:", err);
		  alert("Profile fetch failed.");
		}
	  });
  }
  