// src/components/Auth.jsx

import React, { useState } from "react";
import { Calendar } from "lucide-react";
import storage from "../utils/storage";

const Auth = ({ onLogin }) => {
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
				<div className="text-center mb-8">
					<div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<Calendar className="w-8 h-8 text-indigo-600" />
					</div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">Day Planner</h1>
					<p className="text-gray-600">Organize your day, achieve your goals</p>
				</div>

				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
							placeholder="Enter your email"
							onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
							placeholder="Enter your password"
							onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
						/>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
							{error}
						</div>
					)}

					<button
						onClick={handleSubmit}
						className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						{isLogin ? "Sign In" : "Sign Up"}
					</button>

					<div className="text-center">
						<button
							type="button"
							onClick={() => setIsLogin(!isLogin)}
							className="text-indigo-600 hover:text-indigo-800 font-medium"
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
