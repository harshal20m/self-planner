import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	theme: {
		extend: {
			keyframes: {
				shine: {
					"0%": { "background-position": "100%" },
					"100%": { "background-position": "-100%" },
				},
			},
			animation: {
				shine: "shine 5s linear infinite",
			},
		},
	},
	plugins: [react(), tailwindcss()],
});
