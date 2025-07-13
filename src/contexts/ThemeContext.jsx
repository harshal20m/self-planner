// src/contexts/ThemeContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

export const themes = {
	light: {
		name: "Light",
		colors: {
			primary: "bg-indigo-600",
			primaryHover: "hover:bg-indigo-700",
			primaryLight: "bg-indigo-100",
			primaryText: "text-indigo-600",
			primaryTextHover: "hover:text-indigo-800",
			background: "bg-gray-50",
			backgroundSecondary: "bg-white",
			backgroundGradient: "bg-gradient-to-br from-blue-50 to-indigo-100",
			text: "text-gray-800",
			textSecondary: "text-gray-600",
			textMuted: "text-gray-500",
			textLight: "text-gray-400",
			border: "border-gray-200",
			borderInput: "border-gray-300",
			borderHover: "hover:border-indigo-500",
			shadow: "shadow-sm",
			shadowHover: "hover:shadow-md",
			ring: "focus:ring-indigo-500",
			progressBg: "bg-gray-200",
			progressFill: "bg-indigo-600",
			success: "bg-green-500",
			error: "bg-red-50 border-red-200 text-red-700",
			cardBg: "bg-white",
			inputBg: "bg-white",
			hoverBg: "hover:bg-indigo-50",
		},
	},
	dark: {
		name: "Dark",
		colors: {
			primary: "bg-indigo-600",
			primaryHover: "hover:bg-indigo-700",
			primaryLight: "bg-indigo-900",
			primaryText: "text-indigo-400",
			primaryTextHover: "hover:text-indigo-300",
			background: "bg-gray-900",
			backgroundSecondary: "bg-gray-800",
			backgroundGradient: "bg-gradient-to-br from-gray-900 to-indigo-900",
			text: "text-gray-100",
			textSecondary: "text-gray-300",
			textMuted: "text-gray-400",
			textLight: "text-gray-500",
			border: "border-gray-700",
			borderInput: "border-gray-600",
			borderHover: "hover:border-indigo-500",
			shadow: "shadow-lg",
			shadowHover: "hover:shadow-xl",
			ring: "focus:ring-indigo-500",
			progressBg: "bg-gray-700",
			progressFill: "bg-indigo-500",
			success: "bg-green-600",
			error: "bg-red-900 border-red-700 text-red-300",
			cardBg: "bg-gray-800",
			inputBg: "bg-gray-700",
			hoverBg: "hover:bg-indigo-900",
		},
	},
	goldish: {
		name: "Goldish",
		colors: {
			primary: "bg-yellow-600",
			primaryHover: "hover:bg-yellow-700",
			primaryLight: "bg-yellow-100",
			primaryText: "text-yellow-600",
			primaryTextHover: "hover:text-yellow-800",
			background: "bg-amber-50",
			backgroundSecondary: "bg-white",
			backgroundGradient: "bg-gradient-to-br from-yellow-50 to-amber-100",
			text: "text-amber-900",
			textSecondary: "text-amber-800",
			textMuted: "text-amber-600",
			textLight: "text-amber-500",
			border: "border-amber-200",
			borderInput: "border-amber-300",
			borderHover: "hover:border-yellow-500",
			shadow: "shadow-amber-200/50",
			shadowHover: "hover:shadow-amber-300/50",
			ring: "focus:ring-yellow-500",
			progressBg: "bg-amber-200",
			progressFill: "bg-yellow-600",
			success: "bg-green-600",
			error: "bg-red-50 border-red-200 text-red-700",
			cardBg: "bg-white",
			inputBg: "bg-white",
			hoverBg: "hover:bg-yellow-50",
		},
	},
	blueish: {
		name: "Blueish",
		colors: {
			primary: "bg-blue-600",
			primaryHover: "hover:bg-blue-700",
			primaryLight: "bg-blue-100",
			primaryText: "text-blue-600",
			primaryTextHover: "hover:text-blue-800",
			background: "bg-blue-50",
			backgroundSecondary: "bg-white",
			backgroundGradient: "bg-gradient-to-br from-blue-50 to-cyan-100",
			text: "text-blue-900",
			textSecondary: "text-blue-800",
			textMuted: "text-blue-600",
			textLight: "text-blue-500",
			border: "border-blue-200",
			borderInput: "border-blue-300",
			borderHover: "hover:border-blue-500",
			shadow: "shadow-blue-200/50",
			shadowHover: "hover:shadow-blue-300/50",
			ring: "focus:ring-blue-500",
			progressBg: "bg-blue-200",
			progressFill: "bg-blue-600",
			success: "bg-green-600",
			error: "bg-red-50 border-red-200 text-red-700",
			cardBg: "bg-white",
			inputBg: "bg-white",
			hoverBg: "hover:bg-blue-50",
		},
	},
	midnight: {
		name: "Midnight",
		colors: {
			primary: "bg-purple-600",
			primaryHover: "hover:bg-purple-700",
			primaryLight: "bg-purple-900",
			primaryText: "text-purple-400",
			primaryTextHover: "hover:text-purple-300",
			background: "bg-slate-900",
			backgroundSecondary: "bg-slate-800",
			backgroundGradient: "bg-gradient-to-br from-slate-900 to-purple-900",
			text: "text-slate-100",
			textSecondary: "text-slate-300",
			textMuted: "text-slate-400",
			textLight: "text-slate-500",
			border: "border-slate-700",
			borderInput: "border-slate-600",
			borderHover: "hover:border-purple-500",
			shadow: "shadow-lg",
			shadowHover: "hover:shadow-xl",
			ring: "focus:ring-purple-500",
			progressBg: "bg-slate-700",
			progressFill: "bg-purple-600",
			success: "bg-green-600",
			error: "bg-red-900 border-red-700 text-red-300",
			cardBg: "bg-slate-800",
			inputBg: "bg-slate-700",
			hoverBg: "hover:bg-purple-900",
		},
	},
};

export const ThemeProvider = ({ children }) => {
	const [currentTheme, setCurrentTheme] = useState("light");

	useEffect(() => {
		// Load theme from localStorage
		const savedTheme = localStorage.getItem("theme") || "light";
		setCurrentTheme(savedTheme);
	}, []);

	const changeTheme = (themeName) => {
		setCurrentTheme(themeName);
		localStorage.setItem("theme", themeName);
	};

	const theme = themes[currentTheme];

	return (
		<ThemeContext.Provider value={{ theme, currentTheme, changeTheme, themes }}>{children}</ThemeContext.Provider>
	);
};
