// src/components/HistoryView.jsx

import React, { useEffect, useState } from "react";
import { Calendar, Check } from "lucide-react";
import storage from "../utils/storage";
import { parseTimeForSorting } from "../utils/timeUtils";

const HistoryView = ({ userId }) => {
	const [historyData, setHistoryData] = useState([]);
	const [filter, setFilter] = useState("all");

	useEffect(() => {
		const dates = storage.getAllPlannerDates(userId);
		const data = dates.map((date) => {
			const plannerData = storage.getPlannerData(userId, date);
			const tasks = plannerData.tasks || {};

			let totalTasks = 0;
			let completedTasks = 0;

			for (const slot of Object.values(tasks)) {
				const subtasks = slot?.subtasks || [];
				totalTasks += subtasks.length;
				completedTasks += subtasks.filter((s) => s.done).length;
			}

			return {
				date,
				tasks,
				totalTasks,
				completedTasks,
				completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
			};
		});
		setHistoryData(data);
	}, [userId]);

	const filteredData = historyData.filter((day) => {
		if (filter === "completed") return day.completedTasks > 0;
		if (filter === "incomplete") return day.totalTasks > day.completedTasks;
		return true;
	});

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold text-gray-800">Task History</h2>
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				>
					<option value="all">All Days</option>
					<option value="completed">Days with Completed Tasks</option>
					<option value="incomplete">Days with Incomplete Tasks</option>
				</select>
			</div>

			{filteredData.length === 0 ? (
				<div className="text-center py-12">
					<Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-500">No planner history found</p>
				</div>
			) : (
				<div className="space-y-4">
					{filteredData.map((day) => (
						<div key={day.date} className="bg-white rounded-lg border border-gray-200 p-6">
							<div className="flex items-center justify-between mb-4">
								<div>
									<h3 className="font-semibold text-gray-800">{day.date}</h3>
									<p className="text-sm text-gray-600">
										{day.completedTasks} of {day.totalTasks} tasks completed ({day.completionRate}%)
									</p>
								</div>
								<div className="bg-gray-200 rounded-full h-2 w-24">
									<div
										className="bg-indigo-600 h-2 rounded-full"
										style={{ width: `${day.completionRate}%` }}
									></div>
								</div>
							</div>

							{Object.keys(day.tasks).length > 0 && (
								<div className="space-y-3">
									{Object.entries(day.tasks)
										.sort(([a], [b]) => parseTimeForSorting(a) - parseTimeForSorting(b))
										.map(([time, task]) => (
											<div key={time}>
												<p className="text-sm font-medium text-gray-700 mb-1">{time}</p>
												{(task.subtasks || []).map((subtask, idx) => (
													<div
														key={idx}
														className="flex items-center space-x-3 p-2 bg-gray-50 rounded"
													>
														<div
															className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
																subtask.done
																	? "bg-green-500 border-green-500"
																	: "border-gray-300"
															}`}
														>
															{subtask.done && <Check className="w-2 h-2 text-white" />}
														</div>
														<span
															className={`text-sm flex-1 ${
																subtask.done
																	? "line-through text-gray-400"
																	: "text-gray-800"
															}`}
														>
															{subtask.text}
														</span>
													</div>
												))}
											</div>
										))}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default HistoryView;
