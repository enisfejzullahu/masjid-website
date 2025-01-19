import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService"; // Ensure this service works with Firebase
import { Link } from "react-router-dom";
import Header from "./reusable/Header";
import Footer from "./reusable/Footer";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!termsAccepted) {
      setError("You must accept the terms and conditions.");
      return;
    }

    try {
      const response = await signup(email, password, fullName, phoneNumber);

      // Redirect to confirmation page with state
      navigate("/konfirmo-email", { state: { fromSignup: true } });
    } catch (err) {
      setError(err.message); // Display error message
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (success) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-primary">
            Check Your Email
          </h1>
          <p className="text-gray-600 italic pt-4">
            A verification email has been sent to your inbox. Please verify your
            email address to activate your account.
          </p>
          <Link to="/kycu" className="text-primary underline mt-4">
            Go to Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col items-center px-6 py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-primary">
          Regjistrohu
        </h1>
        <p className="text-gray-600 italic pt-2 text-center text-sm lg:text-base">
          Kjo pjesë është e rezervuar vetëm për{" "}
          <span className="font-bold">administratën e xhamisë</span>.
        </p>
        <form
          onSubmit={handleSignup}
          className="flex flex-col space-y-4 p-4 max-w-md w-full"
        >
          {/* Form Fields */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm text-left font-bold mb-1"
            >
              Emri i Plotë
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Filan Fisteku"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-2 border-2 border-primary rounded text-sm lg:text-base"
            />
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm text-left font-bold mb-1"
            >
              Numri i Telefonit
            </label>
            <input
              id="phoneNumber"
              type="text"
              placeholder="+383 49 123 456"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full p-2 border-2 border-primary rounded text-sm lg:text-base"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-left font-bold mb-1"
            >
              Email
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
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            <label
              htmlFor="terms"
              className="text-sm text-primary cursor-pointer"
            >
              Kam pranuar të gjitha{" "}
              <Link
                to="/terms-and-conditions"
                className="text-primary underline"
              >
                termat dhe kushtet
              </Link>
            </label>
          </div>
          <button
            type="submit"
            className="w-[70%] mx-auto py-3 bg-primary text-white font-bold rounded hover:bg-primary-light transition text-sm lg:text-base"
          >
            Regjistrohu
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="text-center pt-6 space-y-4 max-w-3xl mx-auto">
          <p className="text-gray-600 text-sm lg:text-base">
            Keni një llogari?{" "}
            <Link to="/kycu" className="text-black font-bold">
              Kyçu
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
