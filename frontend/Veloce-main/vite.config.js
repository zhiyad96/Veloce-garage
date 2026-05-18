
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
});




// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       animation: {
//         // slow and smooth spin like a real alloy wheel
//         'spin-slow': 'spin 2.5s linear infinite',
//         'spin-medium': 'spin 1.5s linear infinite',
//       },
//       keyframes: {
//         // you can even define a custom acceleration-deceleration spin later
//       },
//     },
//   },
//   plugins: [],
// };
