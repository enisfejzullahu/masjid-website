import React, { useState } from "react";
import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";
import emailjs from "emailjs-com";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "your_service_id", // Replace with your EmailJS service ID
        "your_template_id", // Replace with your template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "your_user_id" // Replace with your EmailJS public key
      )
      .then(
        () => {
          alert("Email sent successfully!");
          setFormData({ name: "", email: "", subject: "", message: "" });
        },
        (error) => {
          alert("Failed to send the message, please try again.");
        }
      );
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="relative pb-14 lg:py-12">
        {/* Hero Section */}
        <h1 className="text-3xl lg:text-4xl font-extrabold text-primary text-center mt-14 lg:mt-8 mb-10">
          Na Kontaktoni
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
          Keni pyetje, sugjerime, ose kërkoni ndihmë? Jemi këtu për t'ju
          ndihmuar! Mos ngurroni të na kontaktoni për çdo çështje që lidhet me
          aplikacionin tonë.
        </p>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Dërgoni Mesazhin Tuaj
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Emri juaj"
                required
                className="p-4 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email-i juaj"
                required
                className="p-4 border rounded-lg"
              />
            </div>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subjekti"
              required
              className="p-4 border rounded-lg w-full mt-6"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Mesazhi juaj"
              required
              className="p-4 border rounded-lg w-full mt-6 h-32"
            />
            <button
              type="submit"
              className="w-full mt-6 bg-primary text-white p-4 rounded-lg font-semibold hover:bg-green-700"
            >
              Dërgo Mesazhin
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-lg">
            Mund të na kontaktoni edhe në:{" "}
            <span className="font-bold">support@xhamiaime.com</span>
          </p>
          <p className="text-lg">Telefoni: +355 68 123 4567</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
