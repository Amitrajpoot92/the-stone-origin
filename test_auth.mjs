import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0BwtDMD4gQv0ctKSOPLFrdS2oR4ooNaE",
  authDomain: "mobiles-4822a.firebaseapp.com",
  projectId: "mobiles-4822a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function test() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, "24phonewala@gmail.com", "24phonewala@123");
    console.log("SUCCESS! User:", userCredential.user.uid);
  } catch (error) {
    console.error("FAILED:", error.code, error.message);
  }
  process.exit();
}

test();
