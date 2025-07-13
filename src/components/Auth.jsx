// src/components/Auth.jsx

import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ThemeSelector from "./ThemeSelector";
import storage from "../utils/storage";

const Auth = ({ onLogin }) => {
	const { theme } = useTheme();
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");

		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}

		if (isLogin) {
			const user = storage.findUser(email, password);
			if (user) {
				storage.setCurrentUser(user);
				onLogin(user);
			} else {
				setError("Invalid email or password");
			}
		} else {
			const existingUsers = storage.getUsers();
			if (existingUsers.find((u) => u.email === email)) {
				setError("Email already exists");
				return;
			}
			const newUser = storage.saveUser({ email, password, createdAt: new Date().toISOString() });
			storage.setCurrentUser(newUser);
			onLogin(newUser);
		}
	};

	return (
		<div className={`min-h-screen ${theme.colors.backgroundGradient} flex items-center justify-center p-4`}>
			<div className={`${theme.colors.backgroundSecondary} rounded-2xl shadow-xl p-8 w-full max-w-md relative`}>
				{/* Theme Selector */}
				<div className="absolute top-4 right-4">
					<ThemeSelector />
				</div>

				<div className="text-center mb-8">
					<div
						className={`${theme.colors.primaryLight} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
					>
						<Calendar className={`w-8 h-8 ${theme.colors.primaryText}`} />
					</div>
					<h1 className={`text-3xl font-bold ${theme.colors.text} mb-2`}>Day Planner</h1>
					<p className={theme.colors.textSecondary}>Organize your day, achieve your goals</p>
				</div>

				<div className="space-y-6">
					<div>
						<label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={`w-full px-4 py-3 border ${theme.colors.borderInput} ${theme.colors.inputBg} ${theme.colors.text} rounded-lg focus:ring-2 ${theme.colors.ring} focus:border-transparent transition-colors`}
							placeholder="Enter your email"
							onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
						/>
					</div>

					<div>
						<label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={`w-full px-4 py-3 border ${theme.colors.borderInput} ${theme.colors.inputBg} ${theme.colors.text} rounded-lg focus:ring-2 ${theme.colors.ring} focus:border-transparent transition-colors`}
							placeholder="Enter your password"
							onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
						/>
					</div>

					{error && <div className={`${theme.colors.error} rounded-lg p-3 text-sm`}>{error}</div>}

					<button
						onClick={handleSubmit}
						className={`w-full ${theme.colors.primary} text-white py-3 px-4 rounded-lg font-medium ${theme.colors.primaryHover} transition-colors focus:ring-2 ${theme.colors.ring} focus:ring-offset-2`}
					>
						{isLogin ? "Sign In" : "Sign Up"}
					</button>

					<div className="text-center">
						<button
							type="button"
							onClick={() => setIsLogin(!isLogin)}
							className={`${theme.colors.primaryText} ${theme.colors.primaryTextHover} font-medium`}
						>
							{isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Auth;
