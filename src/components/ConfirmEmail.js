import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resendVerificationEmail } from "../services/authService"; // Import the actual function

const ConfirmEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidAccess, setIsValidAccess] = useState(false); // State to check if access is valid
  const [loading, setLoading] = useState(false); // State for loading status

  // Check if the user came from the signup flow
  useEffect(() => {
    if (location.state?.fromSignup || location.state?.fromLogin) {
      setIsValidAccess(true);
    } else {
      navigate("/"); // Redirect if not coming from the allowed flows
    }
  }, [location, navigate]);

  // Function to resend the email
  const handleResendEmail = async () => {
    setLoading(true); // Start loading
    try {
      await resendVerificationEmail(); // Call the actual resend email function
      alert("Emaili i verifikimit është dërguar përsëri.");
    } catch (error) {
      alert(
        "Ka ndodhur një gabim gjatë dërgimit të emailit. Ju lutem provoni përsëri."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // While verifying access, show nothing or a spinner
  if (!isValidAccess) {
    return null; // Alternatively, render a spinner here
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl sm:text-3xl font-semibold text-primary underline pb-12">
        Llogaria juaj është krijuar me sukses!
      </h1>
      <h1 className="text-2xl sm:text-3xl font-semibold text-primary">
        Kontrollo Emailin Tënd
      </h1>
      <p className="text-gray-600 italic pt-4 mx-auto max-w-5xl">
        A verification email has been sent to your inbox. Please verify your
        email address to activate your account.
        <br />
        Nje email verifikimi eshte derguar ne emailin tuaj. Ju lutem verifikoni
        adresën tuaj të emailit për të aktivizuar llogarinë tuaj.
      </p>
      <p className="text-gray-600 pt-12">
        Pas verifikimit, mund të kyçeni duke përdorur kredencialet tuaja.
      </p>

      <button
        onClick={handleResendEmail}
        disabled={loading}
        className={`mt-6 underline ${
          loading ? "text-gray-400" : "text-primary"
        }`}
      >
        {loading ? "Duke dërguar..." : "Dërgo përsëri emailin e verifikimit"}
      </button>

      <Link to="/kycu" className="text-primary underline mt-12">
        Shko tek Kyçja
      </Link>
    </div>
  );
};

export default ConfirmEmail;
