/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            colors: {
                "bright-orange": "#f06543",
                "off-white": "#e8e9eb",
                "off-black": "#313638",
                "white-teeth": "#e0dfd5",
                "dim-orange": "#f09d51"
            }
        }
    },
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    plugins: []
};
