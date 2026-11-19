import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "./firebase";

// Fetch user's additional data (phone, addresses)
export const getUserData = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return { data: userDoc.data(), error: null };
    }
    return { data: null, error: null };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { data: null, error: error.message };
  }
};

// Fetch all users (Admin Only)
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() });
    });
    return { users, error: null };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return { users: [], error: error.message };
  }
};

// Update user's profile information
export const updateUserProfile = async (uid, { displayName, phone }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // Update Auth Profile
    if (displayName && displayName !== user.displayName) {
      await updateProfile(user, { displayName });
    }

    // Update Firestore Document
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      await updateDoc(userDocRef, { phone, updatedAt: new Date() });
    } else {
      await setDoc(userDocRef, { phone, role: "user", addresses: [], createdAt: new Date() });
    }

    return { error: null };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: error.message };
  }
};

// Save a new address or update an existing list
export const saveUserAddress = async (uid, newAddress) => {
  try {
    const { data } = await getUserData(uid);
    let addresses = data?.addresses || [];
    
    // Add new address (can also add a unique ID in the future)
    addresses.push({ ...newAddress, id: Date.now().toString() });

    const userDocRef = doc(db, "users", uid);
    
    // Ensure document exists
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      await updateDoc(userDocRef, { addresses, updatedAt: new Date() });
    } else {
      await setDoc(userDocRef, { role: "user", addresses, createdAt: new Date() });
    }

    return { addresses, error: null };
  } catch (error) {
    console.error("Error saving address:", error);
    return { addresses: [], error: error.message };
  }
};

// Delete an address
export const deleteUserAddress = async (uid, addressId) => {
  try {
    const { data } = await getUserData(uid);
    let addresses = data?.addresses || [];
    
    addresses = addresses.filter(addr => addr.id !== addressId);

    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, { addresses, updatedAt: new Date() });

    return { addresses, error: null };
  } catch (error) {
    console.error("Error deleting address:", error);
    return { addresses: [], error: error.message };
  }
};
