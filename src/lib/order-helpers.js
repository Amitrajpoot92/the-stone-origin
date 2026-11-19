import { collection, addDoc, serverTimestamp, getDocs, doc, getDoc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";

// Create a new order & decrement product inventory
export const createOrder = async (orderData) => {
  try {
    const customOrderId = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      orderId: customOrderId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Auto decrement inventory for each purchased item
    if (Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        if (item.productId) {
          try {
            const productRef = doc(db, "products", item.productId);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              const currentInv = productSnap.data().inventory;
              if (typeof currentInv === "number") {
                const newInv = Math.max(0, currentInv - (Number(item.quantity) || 1));
                await updateDoc(productRef, {
                  inventory: newInv,
                  updatedAt: serverTimestamp(),
                });
              }
            }
          } catch (invErr) {
            console.error("Failed to decrement inventory for item", item.productId, invErr);
          }
        }
      }
    }

    return { id: docRef.id, orderId: customOrderId, error: null };
  } catch (error) {
    console.error("Error creating order:", error);
    return { id: null, orderId: null, error: error.message };
  }
};

// Fetch all orders (Admin Only)
export const getAllOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return { orders, error: null };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], error: error.message };
  }
};

// Update order status (Admin Only)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: error.message };
  }
};

// Fetch orders for a specific user (supports both email and userId)
export const getUserOrders = async (email, userId) => {
  try {
    if (!email && !userId) return { orders: [], error: "No user identifier provided" };

    const ordersMap = new Map();

    // 1. Fetch by userId if available
    if (userId) {
      try {
        const userQ = query(
          collection(db, "orders"),
          where("userId", "==", userId)
        );
        const userSnapshot = await getDocs(userQ);
        userSnapshot.forEach((doc) => {
          ordersMap.set(doc.id, { id: doc.id, ...doc.data() });
        });
      } catch (userErr) {
        console.warn("Could not query orders by userId:", userErr);
      }
    }

    // 2. Fetch by customer.email (ensures backward compatibility)
    if (email) {
      try {
        const emailQ = query(
          collection(db, "orders"),
          where("customer.email", "==", email)
        );
        const emailSnapshot = await getDocs(emailQ);
        emailSnapshot.forEach((doc) => {
          if (!ordersMap.has(doc.id)) {
            ordersMap.set(doc.id, { id: doc.id, ...doc.data() });
          }
        });
      } catch (emailErr) {
        console.warn("Could not query orders by email:", emailErr);
      }
    }

    const orders = Array.from(ordersMap.values());

    // Sort client-side by date desc
    orders.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
      return timeB - timeA;
    });

    return { orders, error: null };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { orders: [], error: error.message };
  }
};
