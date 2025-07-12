// src/App.jsx

import React, { useEffect, useState } from "react";
import Auth from "./components/Auth";
import Planner from "./components/Planner";
import storage from "./utils/storage";

const App = () => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Handle case where existing users don't have IDs (backward compatibility)
	useEffect(() => {
		const currentUser = storage.getCurrentUser();
		if (currentUser && !currentUser.id) {
			// Add ID to existing user
			const updatedUser = { ...currentUser, id: Date.now().toString() };
			storage.setCurrentUser(updatedUser);
			setUser(updatedUser);

			// Update users array with ID
			const users = storage.getUsers();
			const userIndex = users.findIndex((u) => u.email === currentUser.email);
			if (userIndex !== -1) {
				users[userIndex] = updatedUser;
				localStorage.setItem("planner-users", JSON.stringify(users));
			}
		} else {
			setUser(currentUser);
		}
		setIsLoading(false);
	}, []);

	const handleLogin = (userData) => {
		setUser(userData);
	};

	const handleLogout = () => {
		storage.clearCurrentUser();
		setUser(null);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="App">
			{user ? <Planner user={user} onLogout={handleLogout} /> : <Auth onLogin={handleLogin} />}
		</div>
	);
};

export default App;
