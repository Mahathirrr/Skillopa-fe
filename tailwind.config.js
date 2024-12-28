module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: "#6C63FF",
      secondary: "#845EC2",
      accent: "#00C9A7",
      mainText: "#FFFFFF",
      secondaryText: "#B8C1EC",
      primaryLight: "#8B85FF",
      labelText: "#B8C1EC",
      border: "#2A2D3E",
      shimmer: "#2A2D3E",
      ltBorder: "#2A2D3E",
      bodyBg: "#0F1624",
      footerBg: "#080B14",
      formBg: "#171E31",
      tertiaryBg: "#1A2138",
      hoverBg: "rgba(108, 99, 255, 0.1)",
      headerBg: "#0F1624",
      error: "#FF6B6B",
      black: "#000",
      white: "#fff",
      transparent: "transparent",
      gray: {
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827",
      },
    },
    fontFamily: {
      comedik: ["Comedik", "cursive"],
      sans: ["Space Grotesk", "sans-serif"],
      display: ["Comedik", "cursive"],
    },
    extend: {
      animation: {
        gradient: "gradient 8s linear infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
