const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ✅ GET ALL NOTES
export const getNotes = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch notes");

  return await res.json();
};

// ✅ CREATE NOTE
export const createNote = async (noteData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noteData),
  });

  if (!res.ok) throw new Error("Failed to create note");

  return await res.json();
};

// ✅ UPDATE NOTE
export const updateNote = async (id, updatedData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) throw new Error("Failed to update note");

  return await res.json();
};

// ✅ DELETE NOTE
export const deleteNote = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/notes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete note");

  return await res.json();
};