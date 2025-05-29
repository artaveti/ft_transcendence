import { navigateTo } from "../index";

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("auth_token");

  const isFormData = options.body instanceof FormData;

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let body = options.body;

  if (
    !isFormData &&
    headers.get("Content-Type") === "application/json" &&
    (options.method === "POST" || options.method === "PUT")
  ) {
    if (!body) {
      body = JSON.stringify({});
    } else if (typeof body === "object" && !(body instanceof Blob)) {
      body = JSON.stringify(body);
    }
  }

  const headersLog: Record<string, string> = {};
  headers.forEach((value, key) => {
    headersLog[key] = value;
  });

  console.log("authFetch sending:", {
    url,
    token,
    headers: headersLog
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body
    });

    if (response.status === 401 || response.status === 403) {
      console.warn("authFetch: unauthorized request", url);
      // Optional: navigateTo("/login");
    }

    return response;
  } catch (err) {
    console.error("authFetch fetch error:", err);
    return new Response(null, { status: 500 });
  }
}
