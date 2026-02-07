import { db } from "./firebaseconfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "./firebaseconfig";

export const saveNote = async (date, noteText) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const noteRef = doc(db, "users", user.uid, "notes", date); // date = e.g. "2025-05-28"
    await setDoc(noteRef, {
      note: noteText,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Note saved!");
  } catch (error) {
    console.error("❌ Error saving note:", error);
  }
};
