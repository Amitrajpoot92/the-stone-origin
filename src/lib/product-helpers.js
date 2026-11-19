import { collection, addDoc, getDocs, doc, getDoc, query, where, serverTimestamp, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Add a new product (Admin Only)
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error adding product:", error);
    return { id: null, error: error.message };
  }
};

// Fetch all products
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return { products, error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], error: error.message };
  }
};

// Fetch products by category
export const getProductsByCategory = async (categoryId) => {
  try {
    const q = query(collection(db, "products"), where("categoryId", "==", categoryId));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return { products, error: null };
  } catch (error) {
    console.error("Error fetching category products:", error);
    return { products: [], error: error.message };
  }
};

// Fetch a single product by ID
export const getProductById = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { product: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { product: null, error: "Product not found" };
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return { product: null, error: error.message };
  }
};

// Update a product (Admin Only)
export const updateProduct = async (id, productData) => {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    console.error("Error updating product:", error);
    return { error: error.message };
  }
};

// Delete a product (Admin Only)
export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
    return { error: null };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: error.message };
  }
};

// Add a new category (Admin Only)
export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      ...categoryData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error adding category:", error);
    return { id: null, error: error.message };
  }
};

// Fetch all categories
export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return { categories, error: null };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [], error: error.message };
  }
};

// Fetch global attributes
export const getGlobalAttributes = async () => {
  try {
    const docRef = doc(db, "settings", "global_attributes");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { attributes: docSnap.data(), error: null };
    } else {
      return { 
        attributes: { sizes: [], materials: [], finishes: [], themes: [], poses: [], placements: [] }, 
        error: null 
      };
    }
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return { attributes: null, error: error.message };
  }
};

// Update global attributes
export const updateGlobalAttributes = async (attributesData) => {
  try {
    const docRef = doc(db, "settings", "global_attributes");
    await setDoc(docRef, attributesData, { merge: true });
    return { error: null };
  } catch (error) {
    console.error("Error updating attributes:", error);
    return { error: error.message };
  }
};

// Fetch store info
export const getStoreInfo = async () => {
  try {
    const docRef = doc(db, "settings", "store_info");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { storeInfo: docSnap.data(), error: null };
    } else {
      return { 
        storeInfo: { address: "", phone: "", email: "" }, 
        error: null 
      };
    }
  } catch (error) {
    console.error("Error fetching store info:", error);
    return { storeInfo: null, error: error.message };
  }
};

// Update store info
export const updateStoreInfo = async (storeInfoData) => {
  try {
    const docRef = doc(db, "settings", "store_info");
    await setDoc(docRef, storeInfoData, { merge: true });
    return { error: null };
  } catch (error) {
    console.error("Error updating store info:", error);
    return { error: error.message };
  }
};
