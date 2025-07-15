import React, { useEffect, useState } from "react";
import { Calendar, LogOut, History } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ThemeSelector from "./ThemeSelector";
import TimeSlot from "./TimeSlot";
import AddTimeSlot from "./AddTimeSlot";
import HistoryView from "./History";
import storage from "../utils/storage";
import { parseTimeForSorting } from "../utils/timeUtils";
import SyncControls from "./SyncControls";
import Clock from "./Clock";

const Planner = ({ user, onLogout }) => {
	const { theme } = useTheme();
	const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
	const [tasks, setTasks] = useState({});
	const [view, setView] = useState("today");

	const [showUsePreviousModal, setShowUsePreviousModal] = useState(false);
	const [availableDates, setAvailableDates] = useState([]);

	const defaultTimeSlots = ["Morning Study (6:00 AM - 8:00 AM)"];

	useEffect(() => {
		const data = storage.getPlannerData(user.id, currentDate);
		setTasks(data.tasks || {});
	}, [currentDate, user.id]);

	useEffect(() => {
		if (showUsePreviousModal) {
			const allDates = storage.getPlannerDates(user.id);
			const pastDates = allDates
				.filter((d) => d < currentDate)
				.sort((a, b) => new Date(b) - new Date(a)) // sort descending
				.slice(0, 7); // take last 7
			setAvailableDates(pastDates);
		}
	}, [showUsePreviousModal, currentDate, user.id]);

	const saveTasksToStorage = (newTasks) => {
		const data = storage.getPlannerData(user.id, currentDate);
		data.tasks = newTasks;
		data.lastUpdated = new Date().toISOString();
		storage.savePlannerData(user.id, currentDate, data);
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

	const handleUsePreviousPlan = (fromDate) => {
		const prevData = storage.getPlannerData(user.id, fromDate);
		if (!prevData?.tasks) return;

		const mergedTasks = { ...tasks }; // Start with today's tasks

		for (const [time, oldTask] of Object.entries(prevData.tasks)) {
			if (!mergedTasks[time]) {
				// Time slot doesn't exist yet, add it directly
				mergedTasks[time] = { ...oldTask };
			} else {
				// Merge subtasks (avoid duplicate text)
				const existingSubtasks = mergedTasks[time].subtasks || [];
				const existingTexts = new Set(existingSubtasks.map((s) => s.text));
				const newSubtasks = oldTask.subtasks?.filter((s) => !existingTexts.has(s.text)) || [];
				mergedTasks[time].subtasks = [...existingSubtasks, ...newSubtasks];
			}
		}

		setTasks(mergedTasks);
		saveTasksToStorage(mergedTasks);
		setShowUsePreviousModal(false);
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
		<div className={`min-h-screen ${theme.colors.background}`}>
			<div
				className={`${theme.colors.backgroundSecondary} ${theme.colors.shadow} border-b ${theme.colors.border}`}
			>
				<div className="max-w-6xl mx-auto px-4 py-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="flex justify-between sm:flex-row sm:items-center gap-2 sm:gap-6">
							<div className="flex items-center gap-3">
								<div
									className={`${theme.colors.primaryLight} rounded-full w-10 h-10 flex items-center justify-center shrink-0`}
								>
									<Calendar className={`w-5 h-5 ${theme.colors.primaryText}`} />
								</div>
								<div className="text-left">
									<h1 className={`text-xl sm:text-2xl font-bold ${theme.colors.text}`}>
										Day Planner
									</h1>
									<p className={`text-sm sm:text-base ${theme.colors.textSecondary}`}>
										Welcome back, {user.email}
									</p>
								</div>
							</div>

							<div className="sm:hidden mt-1">
								<Clock />
							</div>
						</div>

						<div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-end gap-2 mt-2 sm:mt-0">
							<div className="hidden sm:block mr-2">
								<Clock />
							</div>

							<button
								onClick={() => setView("today")}
								className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
									view === "today"
										? `${theme.colors.primary} text-white`
										: `${theme.colors.textSecondary} ${theme.colors.primaryTextHover} ${theme.colors.hoverBg}`
								}`}
							>
								Today
							</button>
							<button
								onClick={() => setView("history")}
								className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base flex items-center ${
									view === "history"
										? `${theme.colors.primary} text-white`
										: `${theme.colors.textSecondary} ${theme.colors.primaryTextHover} ${theme.colors.hoverBg}`
								}`}
							>
								<History className="w-4 h-4 mr-1" />
								History
							</button>
							<ThemeSelector />
							<SyncControls />
							<button
								title="Logout"
								onClick={onLogout}
								className={`text-sm sm:text-base ${theme.colors.textSecondary} hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors`}
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
									<h2 className={`text-xl font-semibold ${theme.colors.text}`}>
										{currentDate === new Date().toISOString().split("T")[0] ? "Today" : currentDate}
									</h2>
									<p className={theme.colors.textSecondary}>
										{stats.completed} of {stats.total} tasks completed
									</p>
								</div>
								<div className="flex gap-2">
									<input
										type="date"
										value={currentDate}
										onChange={(e) => setCurrentDate(e.target.value)}
										className={`px-3 py-2 border ${theme.colors.borderInput} ${theme.colors.inputBg} ${theme.colors.text} rounded-lg focus:ring-2 ${theme.colors.ring} focus:border-transparent`}
									/>
								</div>
							</div>

							{stats.total > 0 && (
								<div className={`${theme.colors.progressBg} rounded-full h-2 mb-6`}>
									<div
										className={`${theme.colors.progressFill} h-2 rounded-full transition-all duration-300`}
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
							<div
								className={`${theme.colors.cardBg} rounded-lg border-2 border-dashed ${theme.colors.borderInput} p-6 text-center hover:${theme.colors.borderHover} transition-colors`}
							>
								<button
									onClick={() => setShowUsePreviousModal(true)}
									className={`flex items-center justify-center space-x-2 w-full ${theme.colors.textSecondary} ${theme.colors.primaryTextHover} transition-colors`}
								>
									Use Previous Plan
								</button>
							</div>
						</div>

						{showUsePreviousModal && (
							<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
								<div
									className={`p-6 max-w-sm w-full rounded-xl shadow-xl border ${theme.colors.backgroundSecondary} ${theme.colors.border}`}
								>
									<h3 className={`text-lg font-semibold mb-4 ${theme.colors.text}`}>
										Select a previous date
									</h3>

									{availableDates.length === 0 ? (
										<p className={theme.colors.textSecondary}>No previous plans found.</p>
									) : (
										<ul className="space-y-2 max-h-60 overflow-y-auto">
											{availableDates.map((date) => (
												<li key={date}>
													<button
														onClick={() => handleUsePreviousPlan(date)}
														className={`w-full text-left px-4 py-2 rounded-lg transition font-normal ${theme.colors.hoverBg} ${theme.colors.textSecondary} ${theme.colors.primaryTextHover}`}
													>
														{date}
													</button>
												</li>
											))}
										</ul>
									)}

									<div className="mt-4 flex justify-end">
										<button
											onClick={() => setShowUsePreviousModal(false)}
											className={`text-sm font-medium transition ${theme.colors.textSecondary} ${theme.colors.primaryTextHover}`}
										>
											Close
										</button>
									</div>
								</div>
							</div>
						)}
					</>
				) : (
					<HistoryView userId={user.id} />
				)}
			</div>
		</div>
	);
};

export default Planner;
