import { baseUrl } from "./config";

// ↪️ GENERISANJE IZVEŠTAJA
export async function generateReport(prompt) {
  const response = await fetch(`${baseUrl}/api/generate-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ⬅️ cookie-based auth
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Network response was not ok: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();
  return data.report;
}

// ↪️ SLANJE IZVEŠTAJA
export async function sendReport(email, pdfBlob) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("pdf", pdfBlob, "izvestaj.pdf");

  const response = await fetch(`${baseUrl}/api/send-report`, {
    method: "POST",
    credentials: "include", // ⬅️ cookie-based auth
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to send report");
  }
}

// ↪️ LOGIN
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ⬅️ bitno za primanje cookie-ja
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Greška: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Više ne čuvaš token, samo podatke o useru
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("role", data.user.role);

    return data;
  } catch (error) {
    console.error("Login greška:", error.message);
    throw error;
  }
}

// ↪️ LOGOUT
export async function logoutUser() {
  await fetch(`${baseUrl}/api/logout`, {
    method: "POST",
    credentials: "include", // ⬅️ šalje cookie kako bi server znao koga da izloguje
  });

  localStorage.removeItem("user");
  localStorage.removeItem("role");
}

// ↪️ SESSION (provera da li postoji token u cookie-ju)
export async function getSession() {
  try {
    const response = await fetch(`${baseUrl}/api/session`, {
      method: "GET",
      credentials: "include", // ⬅️ cookie-based auth
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Session error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getSession error:", error.message);
    throw error;
  }
}

export async function registerUser(formData) {
  try {
    const response = await fetch(`${baseUrl}/api/register`, {
      method: "POST",
      credentials: "include", // ⬅️ koristi cookie token
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Nevalidan JSON: ${text}`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || "Došlo je do greške");
    }

    return data;
  } catch (error) {
    console.error("Registracija greška:", error.message);
    throw error;
  }
}

export async function fetchProfile() {
  const response = await fetch(`${baseUrl}/api/me`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Profile error: ${response.status}`);
  }
  return await response.json()
}