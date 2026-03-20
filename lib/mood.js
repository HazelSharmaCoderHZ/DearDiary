const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getMoods = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/moods`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

export const setMood = async (date, mood) => {
  const token = localStorage.getItem("token");

  await fetch(`${API}/moods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date, mood }),
  });
};