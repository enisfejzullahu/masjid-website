import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { auth } from "../../firebaseConfig"; // Import your Firebase config
import { onAuthStateChanged } from "firebase/auth";

import Logo from "../../assets/page_logo.png";
import AppStoreLogo from "../../assets/AppStoreLogo.svg";
import GooglePlayLogo from "../../assets/PlayStoreLogo.svg";
import InstagramIcon from "../../assets/Instagram.svg";
import FacebookIcon from "../../assets/Facebook.svg";
import YoutubeIcon from "../../assets/Youtube.svg";

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set to true if user exists, otherwise false
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <footer className="bg-[#06A85D] text-white py-12">
      <div className="container mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div>
          {/* Logo */}
          <img
            src={Logo}
            alt="Logo"
            className="w-24 mb-6 rounded-full mx-auto md:mx-0"
          />

          {/* App Store and Play Store Logos */}
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={AppStoreLogo}
                alt="Download on App Store"
                className="w-36"
              />
            </a>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={GooglePlayLogo}
                alt="Get it on Google Play"
                className="w-36"
              />
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div>
          {/* Main Pages Links */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Main Links */}
            <NavLink
              to="/"
              className="text-base font-medium hover:underline active:font-bold"
            >
              Ballina
            </NavLink>
            <NavLink
              to="/rrethnesh"
              className="text-base font-medium hover:underline active:font-bold"
            >
              Rreth Nesh
            </NavLink>
            <NavLink
              to="/kontakti"
              className="text-base font-medium hover:underline active:font-bold"
            >
              Kontakti
            </NavLink>
            <NavLink
              to="/xhamite"
              className="text-base font-medium hover:underline active:font-bold"
            >
              Xhamitë
            </NavLink>

            {/* Divider */}
            <div className="col-span-2 border-t border-white my-4"></div>

            {/* Differentiated Links */}
            <NavLink
              to="/termat-dhe-kushtet"
              className="text-base font-medium hover:underline text-white active:font-bold active:text-white"
            >
              Termat Dhe Kushtet
            </NavLink>
            <NavLink
              to="/mbrojtja-e-te-dhenave"
              className="text-base font-medium hover:underline text-white active:font-bold active:text-white"
            >
              Mbrojtja e Të Dhënave
            </NavLink>
          </div>

          <NavLink
            to={isLoggedIn ? "/dashboard" : "/kycu"}
            className="w-[100%] py-3 px-16 bg-white text-[#06A85D] font-montserrat font-semibold rounded-3xl shadow-lg hover:shadow-xl hover:bg-[#2CC484] hover:text-white transition-all duration-300"
          >
            {isLoggedIn ? "Profili" : "Kyçu"}
          </NavLink>

          {/* Kyçu Button
          <div className="pr-24 pb-8">
            <button className="w-[50%] py-3 bg-white text-[#06A85D] font-montserrat font-semibold rounded-3xl shadow-lg hover:shadow-xl hover:bg-[#2CC484] hover:text-white transition-all duration-300">
              <Link to="/kycu" className="block w-full h-full">
                Kyçu
              </Link>
            </button>
          </div> */}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white my-8"></div>

      {/* Footer Bottom */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-12 space-y-4 sm:space-y-0">
        {/* Copyright */}
        <p className="text-sm font-medium text-center sm:text-left">
          Copyright 2024, Xhamia Ime
        </p>

        {/* Social Media Icons */}
        <div className="flex justify-center sm:justify-start space-x-4">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={InstagramIcon} alt="Instagram" className="w-6 h-6" />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={FacebookIcon} alt="Facebook" className="w-6 h-6" />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={YoutubeIcon} alt="YouTube" className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
