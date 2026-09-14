/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  safelist: [
    // Backgrounds & Hover
    "bg-indigo-600", "hover:bg-indigo-700", "bg-indigo-50", "text-indigo-600", "text-indigo-700", "border-indigo-100", "border-indigo-200", "focus:ring-indigo-500", "focus:border-indigo-500", "from-indigo-600", "to-blue-500",
    "bg-rose-600", "hover:bg-rose-700", "bg-rose-50", "text-rose-600", "text-rose-700", "border-rose-100", "border-rose-200", "focus:ring-rose-500", "focus:border-rose-500", "from-rose-600", "to-pink-500",
    "bg-emerald-600", "hover:bg-emerald-700", "bg-emerald-50", "text-emerald-600", "text-emerald-700", "border-emerald-100", "border-emerald-200", "focus:ring-emerald-500", "focus:border-emerald-500", "from-emerald-600", "to-teal-500",
    "bg-amber-600", "hover:bg-amber-700", "bg-amber-50", "text-amber-600", "text-amber-700", "border-amber-100", "border-amber-200", "focus:ring-amber-500", "focus:border-amber-500", "from-amber-600", "to-orange-500",
    "bg-violet-600", "hover:bg-violet-700", "bg-violet-50", "text-violet-600", "text-violet-700", "border-violet-100", "border-violet-200", "focus:ring-violet-500", "focus:border-violet-500", "from-violet-600", "to-purple-500",
    "bg-teal-600", "hover:bg-teal-700", "bg-teal-50", "text-teal-600", "text-teal-700", "border-teal-100", "border-teal-200", "focus:ring-teal-500", "focus:border-teal-500", "from-teal-600", "to-cyan-500"
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "15px"
      },
      colors: {
        accent: "#FF8F9C",
        blackish: "#1b1b1b",
        primary: '#001628',
      }
    },
  },
  plugins: [],
};
