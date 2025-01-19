import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const GoUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show or hide the button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 border-2 border-white right-6 bg-[#06A85D] text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-50"
          aria-label="Go to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default GoUpButton;
