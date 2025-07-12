// src/components/TimeSlot.jsx

import React, { useState } from "react";
import { Clock, Plus, Trash2, Check, Edit } from "lucide-react";

const TimeSlot = ({ time, task, onUpdateTask, onDeleteTask, onEditTime }) => {
	const [isEditingTime, setIsEditingTime] = useState(false);
	const [timeText, setTimeText] = useState(time);
	const [newSubtask, setNewSubtask] = useState("");

	const handleSaveTime = () => {
		if (timeText.trim() && timeText !== time) {
			onEditTime(time, timeText.trim());
		}
		setIsEditingTime(false);
		setTimeText(time);
	};

	const handleAddSubtask = () => {
		if (newSubtask.trim()) {
			const updated = {
				...task,
				subtasks: [...(task?.subtasks || []), { text: newSubtask.trim(), done: false }],
			};
			onUpdateTask(time, updated);
			setNewSubtask("");
		}
	};

	const handleUpdateSubtask = (index, updatedSubtask) => {
		const updatedSubtasks = [...task.subtasks];
		updatedSubtasks[index] = updatedSubtask;
		onUpdateTask(time, { ...task, subtasks: updatedSubtasks });
	};

	const handleToggleDone = (index) => {
		const updatedSubtask = {
			...task.subtasks[index],
			done: !task.subtasks[index].done,
		};
		handleUpdateSubtask(index, updatedSubtask);
	};

	const handleDeleteSubtask = (index) => {
		const updated = {
			...task,
			subtasks: task.subtasks.filter((_, i) => i !== index),
		};
		onUpdateTask(time, updated);
	};

	const handleEditText = (index, newText) => {
		const updatedSubtask = {
			...task.subtasks[index],
			text: newText,
		};
		handleUpdateSubtask(index, updatedSubtask);
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center space-x-2 flex-1">
					<Clock className="w-4 h-4 text-gray-500" />
					{isEditingTime ? (
						<input
							type="text"
							value={timeText}
							onChange={(e) => setTimeText(e.target.value)}
							className="font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1"
							onBlur={handleSaveTime}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleSaveTime();
								if (e.key === "Escape") {
									setTimeText(time);
									setIsEditingTime(false);
								}
							}}
							autoFocus
						/>
					) : (
						<span
							className="font-medium text-gray-700 cursor-pointer hover:text-indigo-600 flex-1"
							onClick={() => setIsEditingTime(true)}
							title="Click to edit time"
						>
							{time}
						</span>
					)}
				</div>
				<div className="flex items-center space-x-1">
					<button
						onClick={() => onDeleteTask(time)}
						className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
						title="Delete time slot"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			</div>

			{task?.subtasks?.length > 0 ? (
				<div className="space-y-3 mb-3">
					{task.subtasks.map((subtask, index) => (
						<div key={index} className="flex items-start space-x-3">
							<button
								onClick={() => handleToggleDone(index)}
								className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
									subtask.done
										? "bg-green-500 border-green-500 text-white"
										: "border-gray-300 hover:border-green-500"
								}`}
							>
								{subtask.done && <Check className="w-3 h-3" />}
							</button>
							<input
								type="text"
								value={subtask.text}
								onChange={(e) => handleEditText(index, e.target.value)}
								className={`flex-1 text-sm border-0 bg-transparent focus:outline-none ${
									subtask.done ? "line-through text-gray-500" : "text-gray-800"
								}`}
							/>
							<button
								onClick={() => handleDeleteSubtask(index)}
								className="text-gray-400 hover:text-red-500 p-1 rounded"
								title="Delete subtask"
							>
								<Trash2 className="w-4 h-4" />
							</button>
						</div>
					))}
				</div>
			) : (
				<div className="text-gray-400 text-sm mb-3">No tasks scheduled</div>
			)}

			<div className="flex items-center space-x-2">
				<input
					type="text"
					value={newSubtask}
					onChange={(e) => setNewSubtask(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleAddSubtask();
					}}
					placeholder="Add new subtask..."
					className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
				<button
					onClick={handleAddSubtask}
					className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50"
					title="Add subtask"
				>
					<Plus className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};

export default TimeSlot;
