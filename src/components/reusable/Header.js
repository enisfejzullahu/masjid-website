import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { auth } from "../../firebaseConfig"; // Import your Firebase config
import { onAuthStateChanged } from "firebase/auth";
import Logo from "../../assets/page_logo.png";

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
      {/* Background split */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="h-[100%] w-full bg-[#06A85D]"></div>
        <div className="h-[20%] w-full bg-[#2CC484]"></div>
      </div>

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
          <button
            className="absolute top-4 right-4 text-green-600 font-bold text-xl"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
          <nav className="flex-1 mt-16 px-6">
            <ul className="flex flex-col space-y-6 font-montserrat text-lg font-medium text-green-600">
              <li className="flex items-center space-x-4">
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

          <div className="px-6 pb-8">
            <NavLink
              to={isLoggedIn ? "/dashboard" : "/kycu"}
              onClick={() => setMenuOpen(false)}
              className="w-full py-3 bg-primary text-white font-montserrat rounded-3xl shadow-lg hover:shadow-xl hover:from-green-500 hover:to-green-300 transition-all duration-300 flex items-center justify-center"
            >
              {isLoggedIn ? "Profili" : "Kyçu"}
            </NavLink>
          </div>
        </div>
      )}

      {/* Show either "Kyçu" or "Profili Im" based on login state */}
      <NavLink
        to={isLoggedIn ? "/dashboard" : "/kycu"}
        className="md:block hidden px-8 py-2 bg-white text-primary font-montserrat font-medium rounded-3xl hover:bg-primary-light hover:text-white"
      >
        {isLoggedIn ? "Profili" : "Kyçu"}
      </NavLink>
    </header>
  );
};

export default Header;
