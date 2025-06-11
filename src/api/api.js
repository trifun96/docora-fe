import { baseUrl } from "./config";

export async function generateReport(prompt) {
  const token = localStorage.getItem("token"); // Uzmi token iz localStorage

  console.log(prompt, "prompt");

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
  console.log("generateReport data:", data);

  return data.report; // <-- OVO JE KLJUČNO
}

export async function sendReport(email, pdfBlob) {
  const token = localStorage.getItem("token"); // Uzimamo token iz localStorage

  const formData = new FormData();
  formData.append("email", email);
  formData.append("pdf", pdfBlob, "izvestaj.pdf");

  const response = await fetch(`${baseUrl}/api/send-report`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // <-- Dodaj token ovde
      // Ne dodaj 'Content-Type' jer je multipart/form-data, fetch će to sam odraditi
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

    // ✅ Sačuvaj token i user-a u localStorage
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
