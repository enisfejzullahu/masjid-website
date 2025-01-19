module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { montserrat: ["Montserrat", "sans-serif"] },
      fontSize: {
        "4.5xl": ["2.625rem", "2.5rem"], // Custom size in between 4xl and 5xl
      },
      colors: {
        primary: {
          DEFAULT: "#06A85D", // Main primary color
          light: "#2CC484", // Lighter shade
          dark: "#059149", // Darker shade
        },
      },
    },
  },
  plugins: [],
};
