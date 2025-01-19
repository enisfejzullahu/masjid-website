import React from "react";
import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";

const ContactPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <h1 className="text-3xl font-bold p-20">Kontakti</h1>
      <Footer />
    </div>
  );
};

export default ContactPage;
