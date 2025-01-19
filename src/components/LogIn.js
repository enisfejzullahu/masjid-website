import React, { useEffect, useState } from "react";
import { login } from "../services/authService"; // Ensure this service works with Firebase
import { signOut, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

import { useNavigate, Link } from "react-router-dom";
import Header from "./reusable/Header";
import Footer from "./reusable/Footer";

import GreenBG from "../assets/GreenBG.svg";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(""); // Store the user role here

  const navigate = useNavigate(); // Initialize navigation

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form refresh
    setError(""); // Clear previous error messages

    try {
      const user = await login(email, password); // Login the user

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        setUserRole(role); // Set the role in the state

        // Redirect based on role
        navigate("/dashboard");
      } else {
        setError("User data not found. Please contact support.");
      }
    } catch (err) {
      // Handle login errors
      if (err.message.includes("auth/wrong-password")) {
        setError("Your credentials are not correct. Please try again.");
      } else if (err.message.includes("auth/user-not-found")) {
        setError("User not found. Please check your email.");
      } else {
        setError("Email ose Fjalekalimi i gabuar. Ju lutem provoni përsëri.");
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col items-center px-6 py-12">
        {/* Title Section */}
        <h1 className="text-2xl sm:text-3xl lg:text-3xl  font-semibold text-primary">
          Kyçu ose Regjistrohu
        </h1>
        <p className="text-gray-600 italic pt-2 text-center text-sm lg:text-base">
          Kjo pjesë është e rezervuar vetëm për{" "}
          <span className="font-bold">administratën e xhamisë</span>.
        </p>
        <p className="text-black text-center max-w-3xl pt-8 text-sm lg:text-base">
          Nëse jeni <span className="font-bold">pjesë e stafit</span> të një
          xhamie dhe dëshironi të menaxhoni njoftimet, ngjarjet, donacionet, dhe
          informacionin historik të xhamisë, hyni ose regjistrohuni këtu.
          Përdoruesit e tjerë janë të ftuar të shkarkojnë aplikacionin për të
          ndjekur xhamitë e tyre dhe për të marrë njoftime.
        </p>

        {/* Login Form Section */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col space-y-4 p-4 max-w-md w-full"
        >
          <h2 className="text-2xl font-semibold text-primary text-center pt-8">
            Kyçu
          </h2>
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-left font-bold mb-1"
            >
              Emaili
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border-2 border-primary rounded text-sm lg:text-base"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-left font-bold mb-1"
            >
              Fjalëkalimi
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border-2 border-primary rounded text-sm lg:text-base"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-[70%] mx-auto py-3 bg-primary text-white font-bold rounded hover:bg-primary-light transition text-sm lg:text-base"
          >
            Kyçu
          </button>

          {/* Forgot Password */}
          <p className="text-center underline text-sm text-primary cursor-pointer hover:text-primary-light">
            <Link to="/reset-password">Keni harruar fjalëkalimin?</Link>
          </p>

          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>

        {/* Additional Section */}
        <div className="text-center py-16 space-y-4 max-w-3xl mx-auto">
          {/* Centered and narrowed text */}
          <p className="text-black text-sm lg:text-base">
            A jeni pjesë e stafit të xhamisë suaj? Mësoni më shumë rreth
            aplikacionit "Xhamia Ime" dhe regjistrohuni për të filluar lidhjen
            me komunitetin tuaj sot!
          </p>

          {/* Centered and more rounded button */}
          <Link
            to="/signup"
            className="block w-[70%] lg:w-[40%] mx-auto py-3 text-primary border-2 border-primary rounded-full text-center font-bold hover:bg-primary hover:text-white transition text-sm lg:text-base"
          >
            Regjistrohu
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LogIn;
