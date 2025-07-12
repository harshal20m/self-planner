// src/components/Planner.jsx

import React, { useEffect, useState } from "react";
import { Calendar, LogOut, History } from "lucide-react";
import TimeSlot from "./TimeSlot";
import AddTimeSlot from "./AddTimeSlot";
import HistoryView from "./History";
import storage from "../utils/storage";
import { parseTimeForSorting } from "../utils/timeUtils";

const Planner = ({ user, onLogout }) => {
	const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
	const [tasks, setTasks] = useState({});
	const [view, setView] = useState("today");

	const defaultTimeSlots = ["Morning Study (6:00 AM - 8:00 AM)"];

	useEffect(() => {
		const data = storage.getPlannerData(user.id, currentDate);
		setTasks(data.tasks || {});
	}, [currentDate, user.id]);

	const saveTasksToStorage = (newTasks) => {
		const data = storage.getPlannerData(user.id, currentDate);
		data.tasks = newTasks;
		data.lastUpdated = new Date().toISOString();
		storage.savePlannerData(user.id, currentDate, data);
	};

	const handleAddTask = (time, subtaskText) => {
		const existing = tasks[time]?.subtasks || [];
		const newTasks = {
			...tasks,
			[time]: {
				subtasks: [...existing, { text: subtaskText, done: false, createdAt: new Date().toISOString() }],
			},
		};
		setTasks(newTasks);
		saveTasksToStorage(newTasks);
	};

	const handleUpdateTask = (time, updatedTask) => {
		const newTasks = {
			...tasks,
			[time]: { ...updatedTask, updatedAt: new Date().toISOString() },
		};
		setTasks(newTasks);
		saveTasksToStorage(newTasks);
	};

	const handleDeleteTask = (time) => {
		const newTasks = { ...tasks };
		delete newTasks[time];
		setTasks(newTasks);
		saveTasksToStorage(newTasks);
	};

	const handleEditTime = (oldTime, newTime) => {
		if (oldTime === newTime) return;

		const newTasks = { ...tasks };
		if (newTasks[oldTime]) {
			newTasks[newTime] = { ...newTasks[oldTime], updatedAt: new Date().toISOString() };
			delete newTasks[oldTime];
		}
		setTasks(newTasks);
		saveTasksToStorage(newTasks);
	};

	const handleAddTimeSlot = (timeSlot) => {
		if (!tasks[timeSlot]) {
			const newTasks = {
				...tasks,
				[timeSlot]: { subtasks: [] },
			};
			setTasks(newTasks);
			saveTasksToStorage(newTasks);
		}
	};

	const allTimeSlots = [
		...defaultTimeSlots,
		...Object.keys(tasks).filter((time) => !defaultTimeSlots.includes(time)),
	].sort((a, b) => parseTimeForSorting(a) - parseTimeForSorting(b));

	const todayStats = () => {
		let total = 0;
		let completed = 0;
		Object.values(tasks).forEach((slot) => {
			if (slot?.subtasks) {
				total += slot.subtasks.length;
				completed += slot.subtasks.filter((s) => s.done).length;
			}
		});
		return { total, completed };
	};

	const stats = todayStats();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-6xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center">
								<Calendar className="w-5 h-5 text-indigo-600" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-800">Day Planner</h1>
								<p className="text-gray-600">Welcome back, {user.email}</p>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<button
								onClick={() => setView("today")}
								className={`px-4 py-2 rounded-lg font-medium transition-colors ${
									view === "today"
										? "bg-indigo-600 text-white"
										: "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
								}`}
							>
								Today
							</button>
							<button
								onClick={() => setView("history")}
								className={`px-4 py-2 rounded-lg font-medium transition-colors ${
									view === "history"
										? "bg-indigo-600 text-white"
										: "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
								}`}
							>
								<History className="w-4 h-4 inline mr-2" />
								History
							</button>
							<button
								onClick={onLogout}
								className="text-gray-600 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
							>
								<LogOut className="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-6">
				{view === "today" ? (
					<>
						<div className="mb-6">
							<div className="flex items-center justify-between mb-4">
								<div>
									<h2 className="text-xl font-semibold text-gray-800">
										{currentDate === new Date().toISOString().split("T")[0] ? "Today" : currentDate}
									</h2>
									<p className="text-gray-600">
										{stats.completed} of {stats.total} tasks completed
									</p>
								</div>
								<input
									type="date"
									value={currentDate}
									onChange={(e) => setCurrentDate(e.target.value)}
									className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								/>
							</div>

							{stats.total > 0 && (
								<div className="bg-gray-200 rounded-full h-2 mb-6">
									<div
										className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
										style={{ width: `${(stats.completed / stats.total) * 100}%` }}
									></div>
								</div>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{allTimeSlots.map((time) => (
								<TimeSlot
									key={time}
									time={time}
									task={tasks[time]}
									onUpdateTask={handleUpdateTask}
									onDeleteTask={handleDeleteTask}
									onEditTime={handleEditTime}
								/>
							))}
							<AddTimeSlot onAddTimeSlot={handleAddTimeSlot} />
						</div>
					</>
				) : (
					<HistoryView userId={user.id} />
				)}
			</div>
		</div>
	);
};

export default Planner;
