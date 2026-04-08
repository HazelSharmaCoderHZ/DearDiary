import API from "./api";

export const saveNote = async (date, noteText) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not logged in");

    const res = await fetch(`${API}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`  // ✅ FIX: was just `token`
      },
      body: JSON.stringify({ content: noteText, date })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to save note");
    return data;
  } catch (error) {
    console.error("Error saving note:", error.message);
  }
};