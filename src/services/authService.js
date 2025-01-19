import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// Signup function
export const signup = async (email, password, fullName, phoneNumber) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    // Add user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      phoneNumber,
      email,
      role: "mosque-admin", // Default role
      mosqueId: null, // No mosque assigned yet
    });

    // Log out the user immediately after signup
    await signOut(auth);

    return {
      success: true,
      message: "Account created. Please verify your email.",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Login function
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // console.log("User logged in:", user); // Check if login succeeds

    if (!user.emailVerified) {
      // console.log("Email not verified"); // Debugging unverified email
      await signOut(auth); // Log out unverified users
      throw new Error("Your email is not verified. Please check your inbox.");
    }

    return user; // Successfully logged in
  } catch (error) {
    // console.log("Login error:", error.message); // Log any errors
    throw new Error(error.message);
  }
};

// Logout function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Check if email is verified
export const checkEmailVerification = async () => {
  await auth.currentUser.reload();
  return auth.currentUser.emailVerified;
};

// Assign user to mosque
export const assignUserToMosque = async (adminId, mosqueId) => {
  try {
    await updateDoc(doc(db, "users", adminId), {
      mosqueId,
    });
    // console.log("Mosque assigned successfully.");
  } catch (error) {
    console.error("Error assigning mosque:", error);
    throw new Error("Failed to assign mosque.");
  }
};

export const addUserRole = async (userId, role) => {
  try {
    await updateDoc(doc(db, "users", userId), { role });
  } catch (error) {
    throw new Error(`Failed to add role: ${error.message}`);
  }
};

export const resendVerificationEmail = async () => {
  const user = auth.currentUser;
  if (user) {
    await sendEmailVerification(user);
    return "Verification email sent.";
  } else {
    throw new Error("No authenticated user found.");
  }
};

