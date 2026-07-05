/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
 colors: {
    primary: "#003D9B",
    "primary-container": "#0052CC",

    "surface-highest": "#D7E2FF",
    "surface-low": "#F1F3FF",
    background: "#F9F9FF",
    "background-highest":"F0F1F5",

    navy: "#081B3C",
    gray: "#5F6F7B",
    border: "#C3C6D6",
    label: "#737685",
    "gray-dark":"#434654",
    

    success: "#80E9B5",
    "success-dark":"#005235",
    error: "#E12727",
    warning: "#FFB81B",
  },
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
},
spacing: {
    18: "4.5rem",
    22: "5.5rem",
    30: "7.5rem",
},
borderRadius: {
    xl: "12px",
    "2xl": "16px",
},
boxShadow: {
    card: "0 8px 24px rgba(0,0,0,.08)",
},
fontSize: {
    display: ['56px', '64px'],
    headline: ['40px', '48px'],
    title: ['24px', '32px'],
    body: ['16px', '24px'],
    label: ['12px', '16px'],
}
    },
  },
  plugins: [],
};