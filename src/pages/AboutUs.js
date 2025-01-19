import React from "react";
import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";

const AboutPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <h1 className="text-3xl font-bold p-20">Rreth Nesh</h1>
      <Footer />
    </div>
  );
};

export default AboutPage;
