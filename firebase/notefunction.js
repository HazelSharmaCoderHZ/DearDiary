import API from "./api";

// SAVE NOTE
export const saveNote = async (date, noteText) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("User not logged in");

    const res = await fetch(`${API}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        content: noteText, // ✅ renamed
        date: date
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to save note");
    }

    console.log("✅ Note saved!", data);
    return data;

  } catch (error) {
    console.error("❌ Error saving note:", error.message);
  }
};