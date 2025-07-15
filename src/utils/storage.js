// src/utils/storage.js

const storage = {
	getUsers: () => {
		try {
			return JSON.parse(localStorage.getItem("planner-users") || "[]");
		} catch {
			return [];
		}
	},
	saveUser: (user) => {
		const users = storage.getUsers();
		const userWithId = { ...user, id: Date.now().toString() };
		users.push(userWithId);
		localStorage.setItem("planner-users", JSON.stringify(users));
		return userWithId;
	},
	findUser: (email, password) => {
		const users = storage.getUsers();
		return users.find((u) => u.email === email && u.password === password);
	},
	getCurrentUser: () => {
		try {
			return JSON.parse(localStorage.getItem("planner-current-user") || "null");
		} catch {
			return null;
		}
	},
	setCurrentUser: (user) => localStorage.setItem("planner-current-user", JSON.stringify(user)),
	clearCurrentUser: () => localStorage.removeItem("planner-current-user"),

	getPlannerData: (userId, date) => {
		const key = `planner-${userId}-${date}`;
		try {
			return JSON.parse(localStorage.getItem(key) || "{}");
		} catch {
			return {};
		}
	},
	savePlannerData: (userId, date, data) => {
		const key = `planner-${userId}-${date}`;
		localStorage.setItem(key, JSON.stringify(data));
	},
	getAllPlannerDates: (userId) => {
		const dates = [];
		const prefix = `planner-${userId}-`;
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith(prefix)) {
				const date = key.replace(prefix, "");
				dates.push(date);
			}
		}
		return dates.sort().reverse();
	},
	getUserStats: (userId) => {
		const dates = storage.getAllPlannerDates(userId);
		let totalTasks = 0;
		let completedTasks = 0;

		dates.forEach((date) => {
			const data = storage.getPlannerData(userId, date);
			const tasks = data.tasks || {};
			totalTasks += Object.keys(tasks).length;
			completedTasks += Object.values(tasks).filter((task) => task.done).length;
		});

		return { totalTasks, completedTasks, totalDays: dates.length };
	},
	getPlannerDates: (userId) => {
		const allKeys = Object.keys(localStorage);
		const prefix = `planner-${userId}-`;
		return allKeys.filter((key) => key.startsWith(prefix)).map((key) => key.replace(prefix, ""));
	},
};

const logCurrentUserData = () => {
	const user = storage.getCurrentUser();
	if (!user) {
		console.log("No user logged in.");
		return;
	}

	const allDates = storage.getAllPlannerDates(user.id);
	const plannerData = allDates.reduce((acc, date) => {
		const dayData = storage.getPlannerData(user.id, date);
		acc[date] = dayData;
		return acc;
	}, {});

	const fullUserData = {
		user,
		planner: plannerData,
	};

	console.log("Full User JSON (for server sync):", JSON.stringify(fullUserData, null, 2));
	console.log(fullUserData);
};
logCurrentUserData();

export default storage;
