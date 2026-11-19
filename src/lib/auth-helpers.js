import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updatePassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

// Helper to save/check user in Firestore
const saveUserToFirestore = async (user, additionalData = {}) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    try {
      const customerId = 'TSO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      await setDoc(userRef, {
        email,
        name: displayName || email.split('@')[0],
        photoURL,
        role: "user", // Default role
        customerId,
        createdAt: serverTimestamp(),
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
};

export const registerWithEmail = async (email, password, name, phone) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(user, { name, phone }); // Override name and add phone
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const { user } = await signInWithPopup(auth, provider);
    await saveUserToFirestore(user);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const sendResetEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    console.error("Error sending reset email:", error);
    return { error: error.message };
  }
};
