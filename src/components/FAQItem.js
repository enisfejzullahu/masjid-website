import React, { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAQ = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col">
      {/* Question Row */}
      <div
        onClick={toggleFAQ}
        className="flex justify-between items-center cursor-pointer"
      >
        <h3 className="text-black font-semibold text-sm text-left lg:text-lg w-[90%]">{question}</h3>
        <div className="text-[#06A85D] text-3xl font-medium">{isOpen ? "-" : "+"}</div>
      </div>

      {/* Answer */}
      {isOpen && (
        <div className="mt-2 text-gray-700 text-xs lg:text-sm leading-relaxed text-left font-medium">
          {answer}
        </div>
      )}
    </div>
  );
};

export default FAQItem;
