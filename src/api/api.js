import { baseUrl } from "./config";

export async function generateReport(prompt) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${baseUrl}/api/generate-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Dodaj token u header
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Network response was not ok: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();

  return data.report; // <-- OVO JE KLJUČNO
}

export async function sendReport(email, pdfBlob) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("email", email);
  formData.append("pdf", pdfBlob, "izvestaj.pdf");

  const response = await fetch(`${baseUrl}/api/send-report`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // <-- Dodaj token ovde
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to send report");
  }
}

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Greška: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
    }

    return data;
  } catch (error) {
    console.error("Login greška:", error.message);
    throw error;
  }
}
export async function registerUser(formData) {
  const token = localStorage.getItem("token"); // Token iz localStorage

  try {
    const response = await fetch(`${baseUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(formData)
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


