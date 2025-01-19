import React, { useState, useEffect } from "react";
import "../styles/LandingPage.css";
import { Link, NavLink } from "react-router-dom";
import FAQItem from "../components/FAQItem";
import GoUpButton from "../components/GoUpButton";
import { auth } from "../firebaseConfig"; // Import your Firebase config
import { onAuthStateChanged } from "firebase/auth";

import Logo from "../assets/page_logo.png";
import ShapesWeb from "../assets/ShapesWeb.svg";
import PhonesWeb from "../assets/PhonesWeb.svg";
import GreenBGP from "../assets/GreenBGP.png";
import AppStoreLogo from "../assets/AppStoreLogo.svg";
import GooglePlayLogo from "../assets/PlayStoreLogo.svg";
import PlusIcon from "../assets/PlusIcon.svg";
import StarIcon from "../assets/StarIcon.svg";
import PhoneMockup from "../assets/PhoneMockup.png";
// import InstagramIcon from "../assets/Instagram.svg";
// import FacebookIcon from "../assets/Facebook.svg";
// import YoutubeIcon from "../assets/Youtube.svg";

import Card1 from "../assets/Card1.png";
import Card2 from "../assets/Card2.png";
import Card3 from "../assets/Card3.png";
import Card4 from "../assets/Card4.png";
import Card5 from "../assets/Card5.png";
import Card6 from "../assets/Card6.png";
import Footer from "../components/reusable/Footer";
// import Person1 from "../assets/Person1.jpg";
// import Person2 from "../assets/Person2.jpg";

const LandingPage = () => {
  return (
    <div className="relative w-full">
      {/* Scrollable Content */}
      <div className="relative h-screen w-full">
        {/* Left-Side Background */}
        <div className="absolute top-0 left-0 h-full w-full z-0 overflow-hidden">
          <div
            className="background-image"
            style={{
              backgroundImage: `url(${ShapesWeb})`,
            }}
          ></div>

          {/* Text and Buttons in front of ShapesWeb */}
          <div className="absolute top-1/3 bottom-36 lg:bottom-40 left-6 lg:left-10 transform -translate-y-1/3 text-left z-10 text-white w-4/5 lg:w-3/5">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-montserrat leading-tight text-gray-800 text-white">
              Një Hap Më Pranë <br /> Xhamisë Suaj
            </h1>
            <p className="mt-4 text-xs sm:text-base lg:text-lg font-semibold font-montserrat text-gray-600 text-white">
              Koha e namazit dhe ikametit, ngjarje, <br /> aktivitete,
              donacione, dhe historia e xhamisë <br />– të gjitha në një vend.
            </p>
            {/* App Store & Google Play Buttons */}
            <div className="mt-6 flex space-x-6">
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={AppStoreLogo}
                  alt="Download on the App Store"
                  className="h-8 sm:h-12 md:h-12 lg:h-14 w-auto app-store"
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
                  className="h-8 sm:h-12 md:h-12 lg:h-14 w-auto play-store"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Right-Side Background Image */}
        <img
          src={GreenBGP}
          alt="Green background pattern"
          className="hidden lg:block absolute right-0 top-20 h-auto object-contain z-0 max-w-xs md:max-w-md"
        />

        {/* Right-Side Foreground Image */}
        <img
          src={PhonesWeb}
          alt="Illustration of phones"
          className="hidden lg:block absolute right-24 top-20 h-full object-contain z-10 phones-web"
        />

        {/* Header */}
        <Header />

        {/* Go Up Button */}
        <GoUpButton />
      </div>
      {/* Statistics Section */}
      <div className="relative pb-14 lg:py-12 top-10 bg-white">
        <div className="container mx-auto px-6 sm:px-12">
          <div className="flex flex-col sm:flex-row sm:items-start items-center sm:space-x-12 space-y-6 sm:space-y-0">
            <div className="lg:text-left text-center">
              <div className="flex items-center space-x-2">
                <h3 className="text-4.5xl font-regular font-montserrat text-gray-800">
                  20K
                </h3>
                <img src={PlusIcon} alt="plus icon" className="h-4 w-4 ml-1" />
              </div>
              <p className="text-base font-medium font-montserrat text-black">
                Shkarkime
              </p>
            </div>

            <div className="lg:text-left text-center">
              <div className="flex items-center space-x-2">
                <h3 className="text-4.5xl font-regular font-montserrat text-gray-800">
                  4.7
                </h3>
                <img src={StarIcon} alt="Star icon" className="h-4 w-4 ml-1" />
              </div>
              <p className="text-base font-medium font-montserrat text-black">
                Vlerësime
              </p>
            </div>

            <div className="lg:text-left text-center">
              <div className="flex items-center space-x-2">
                <h3 className="text-4.5xl font-regular font-montserrat text-gray-800">
                  10K
                </h3>
                <img src={PlusIcon} alt="plus icon" className="h-4 w-4 ml-1" />
              </div>
              <p className="text-base font-medium font-montserrat text-black">
                Përdorues
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}

      <div className="relative px-12 lg:px-20 py-14">
        <div className="container mx-auto px-6 sm:px-12 text-center">
          {/* Section Title */}
          <h2 className="text-2xl sm:text-4xl font-semibold font-montserrat text-[#06A85D]">
            Veçoritë
          </h2>
          <p className="mt-4 text-base lg:text-lg font-medium font-montserrat text-black">
            Zbulo veçoritë e aplikacionit
          </p>

          {/* Features Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            {[
              {
                image: Card1,
                title: (
                  <>
                    Oraret E Namazit <br /> Dhe Ikametit
                  </>
                ),
                description:
                  "Shikoni oraret e sakta të namazit dhe ikametit çdo ditë.",
              },
              {
                image: Card2,
                title: (
                  <>
                    Ngjarje Dhe <br /> Aktivitete
                  </>
                ),
                description:
                  "Informohuni për ngjarjet dhe aktivitetet në xhamitë tuaja.",
              },
              {
                image: Card3,
                title: (
                  <>
                    Donacione <br />
                    Të Sigurta
                  </>
                ),
                description:
                  "Ndihmoni xhamitë tuaja me donacione të shpejta dhe të sigurta.",
              },
              {
                image: Card4,
                title: <>Historiku I Xhamisë</>,
                description:
                  "Zbuloni historinë dhe trashëgiminë e xhamive tuaja.",
              },
              {
                image: Card5,
                title: "Njoftimet e Xhamisë",
                description: "Merrni njoftime dhe lajme të fundit nga xhamitë.",
              },
              {
                image: Card6,
                title: "Kërko Xhaminë",
                description: "Gjeni dhe kërkoni xhamitë më afër jush.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="relative h-64 sm:h-80 lg:h-[380px] w-full rounded-lg shadow-lg overflow-hidden cursor-pointer transition"
              >
                {/* Background Image */}
                <img
                  src={feature.image}
                  alt={`Feature ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/80"></div>

                {/* Text at the bottom */}
                <div className="absolute bottom-0 w-full p-4 py-6 text-white">
                  <h3 className="relative text-sm w-[100%] sm:text-lg lg:text-xl font-extrabold font-montserrat text-left pb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-base lg:text-base font-regular text-left w-[90%]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="relative px-6 sm:px-12 py-14">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-semibold font-montserrat text-[#06A85D]">
            Rreth Nesh
          </h2>
          <p className="mt-4 text-base lg:text-lg font-medium font-montserrat text-black">
            Qëllimi i Aplikacionit
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Part */}
          <div className="relative">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
              <img
                src={GreenBGP}
                alt="Background"
                className="w-full h-full object-fit rounded-lg"
              />
            </div>
            {/* Green Rectangle */}
            {/* <div className="w-32 h-8 bg-[#06A85D] rounded-lg absolute top-4 left-4"></div> */}
            {/* Phone Mockups */}
            <img
              src={PhoneMockup}
              alt="Phone Mockup"
              className="w-full max-w-sm mx-auto"
            />
          </div>

          {/* Right Part */}
          <div className="text-center lg:text-left">
            <p className="text-black text-sm text-center lg:text-left lg:text-lg font-regular font-montserrat leading-relaxed sm:flex sm:flex-col">
              Xhamia Ime është një aplikacion modern që lidh xhematin me xhaminë
              e tyre. Ky aplikacion ofron çdo gjë që ju nevojitet, nga oraret e
              sakta të namazit deri te donacionet, aktivitetet dhe historiku i
              xhamisë tuaj.
            </p>

            {/* Button */}
            <button className="mt-6 px-6 py-3 text-sm lg:text-base lg:px-8 lg:py-3 bg-[#06A85D] text-white font-semibold rounded-lg shadow-md hover:bg-[#048048] transition">
              Shiko Më Shumë
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      {/* <div
  className="py-12 bg-cover bg-center relative"
  style={{ backgroundImage: `url('/path-to-your-image.jpg')` }}
>
  <div className="container mx-auto px-4 sm:px-8 text-center">
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-montserrat text-[#06A85D]">
      Çfarë Thonë Përdoruesit Tanë?
    </h2>
    <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium font-montserrat text-black">
      Lexoni mendimet e përdoruesve tanë
    </p>

    <div className="mt-10 overflow-hidden relative">
      <div className="flex items-center space-x-4 animate-loop">
        {[{
          testimonial:
            "Aplikacioni na ka ndihmuar të qëndrojmë të organizuar dhe të informuar. E rekomandoj për çdo xhami!",
          name: "Besnik Hoxha",
          title: "Imam",
          image: Person1,
        },
        {
          testimonial:
            "Një zgjidhje e shkëlqyer për të mbajtur lidhjen mes xhematit dhe xhamisë.",
          name: "Arta Basha",
          title: "Koordinatore",
          image: Person2,
        },
        {
          testimonial:
            "E lehtë për t’u përdorur dhe shumë funksionale. Shumë i dobishëm për komunitetin tonë.",
          name: "Faton Morina",
          title: "Anëtar i Bordit",
          image: Person1,
        },
        ].map((testimonial, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center w-[90%] sm:w-[300px] lg:w-[400px] mx-auto h-[400px] overflow-hidden"
          >
            <div className="text-[#06A85D] text-4xl mb-4">“</div>

            <p className="text-gray-700 text-base font-medium font-montserrat mb-6 px-4">
              {testimonial.testimonial}
            </p>

            <div className="flex items-center mt-auto">
              <div className="w-16 h-16 rounded-full shadow-md overflow-hidden mr-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-left">
                <p className="text-gray-800 font-bold text-sm">
                  {testimonial.name}
                </p>
                <p className="text-gray-500 text-xs">
                  {testimonial.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div> */}

      <div className="py-12 bg-[#06A85D]">
        <div className="container mx-auto px-6 sm:px-12 text-center">
          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-montserrat text-white">
            Pyetjet më të shpeshta
          </h2>
          <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium font-montserrat text-white">
            A keni nevojë për ndihmë apo ndonjë pyetje në lidhje me
            aplikacionin?
          </p>

          {/* FAQ Section */}
          <div className="mt-10 bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
            {[
              {
                question: "A është aplikacioni falas?",
                answer:
                  "Po, aplikacioni është plotësisht falas për t’u përdorur nga të gjithë.",
              },
              {
                question: "A mund të përdoret pa internet?",
                answer:
                  "Aplikacioni mund të përdoret pa internet për të parë oraret e namazit dhe ikametit të mëparshme. Por për të përdorur disa nga funksionet e tjera, nevojitet lidhje me internet.",
              },
              {
                question: "Si mund të kontaktoj mbështetjen?",
                answer:
                  "Ju mund të kontaktoni mbështetjen duke dërguar një email në support@xhamiaime.com.",
              },
              {
                question: "A është i sigurt përdorimi i donacioneve online?",
                answer:
                  "Po, donacionet online janë të sigurta. Ne përdorim lidhje të koduara (SSL) dhe partnerë të autorizuar për të garantuar sigurinë e transaksioneve tuaja.",
              },
              {
                question: "Si funksionojnë donacionet?",
                answer:
                  "Donacionet funksionojne duke përdorur një sistem të sigurt dhe të lehtë për t’u përdorur. Mund të zgjidhni shumë mënyra për të dhënë donacione.",
              },
            ].map((faq, index) => (
              <React.Fragment key={index}>
                <FAQItem question={faq.question} answer={faq.answer} />
                {index < 4 && <hr className="border-gray-300 my-4" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-6 sm:px-12 text-center">
          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-montserrat text-[#06A85D]">
            A keni ndonjë pyetje tjetër?
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium font-montserrat text-black">
            Mos hezitoni të na kontaktoni
          </p>

          {/* Button */}
          <a
            href="mailto:support@xhamiaime.com"
            className="mt-6 inline-block px-8 py-3 bg-[#06A85D] text-sm lg:text-base text-white font-semibold rounded-lg shadow-md hover:bg-[#2CC484] transition"
          >
            contact@xhamiaime.com
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set to true if user exists, otherwise false
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <header className="relative z-20 flex items-center justify-between w-full px-6 py-4 lg:bg-transparent">
      <div className="flex items-center">
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-12 w-12 rounded-full" />
        </Link>
        <div className="h-9 w-px bg-white mx-8 md:block hidden"></div>
        <nav className="md:block hidden">
          <ul className="flex space-x-6 lg:space-x-10 font-montserrat font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                Ballina
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/rrethnesh"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                Rreth Nesh
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/kontakti"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                Kontakti
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/xhamite"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                Xhamitë
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Hamburger Menu */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-green-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="white"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navbar */}
      {menuOpen && (
        <div
          className={`fixed top-0 right-0 h-full w-4/5 bg-gradient-to-b from-green-100 to-white shadow-2xl rounded-l-3xl z-50 flex flex-col transform ${
            menuOpen ? "menu-open" : "menu-slide-in"
          }`}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-green-600 font-bold text-xl"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>

          {/* Navigation Links */}
          <nav className="flex-1 mt-16 px-6">
            <ul className="flex flex-col space-y-6 font-montserrat text-lg font-medium text-green-600">
              <li className="flex items-center space-x-4">
                <i className="fas fa-home"></i>
                <NavLink
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#06A85D] font-bold "
                      : "hover:text-green-800"
                  }
                >
                  Ballina
                </NavLink>
              </li>
              <li className="flex items-center space-x-4">
                <i className="fas fa-info-circle"></i>
                <NavLink
                  to="/rrethnesh"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#06A85D] font-bold "
                      : "hover:text-green-800"
                  }
                >
                  Rreth Nesh
                </NavLink>
              </li>
              <li className="flex items-center space-x-4">
                <i className="fas fa-phone-alt"></i>
                <NavLink
                  to="/kontakti"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#06A85D] font-bold "
                      : "hover:text-green-800"
                  }
                >
                  Kontakti
                </NavLink>
              </li>
              <li className="flex items-center space-x-4">
                <i className="fas fa-mosque"></i>
                <NavLink
                  to="/xhamite"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#06A85D] font-bold "
                      : "hover:text-green-800"
                  }
                >
                  Xhamitë
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Kyçu Button */}
          <div className="px-6 pb-8">
            <NavLink
              to={isLoggedIn ? "/dashboard" : "/kycu"}
              onClick={() => {
                setMenuOpen(false); // Close the menu
              }}
              className="w-full py-3 bg-[#06A85D] text-white font-montserrat rounded-3xl shadow-lg hover:shadow-xl hover:from-green-500 hover:to-green-300 transition-all duration-300 flex items-center justify-center"
            >
              {isLoggedIn ? "Profili" : "Kyçu"}
            </NavLink>
          </div>
        </div>
      )}

      <NavLink
        to={isLoggedIn ? "/dashboard" : "/kycu"}
        className="md:block hidden px-8 py-2 bg-primary text-white font-montserrat font-medium rounded-3xl hover:bg-primary-light hover:text-white"
      >
        {isLoggedIn ? "Profili" : "Kyçu"}
      </NavLink>
    </header>
  );
};

export default LandingPage;
