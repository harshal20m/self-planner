// src/components/AddTimeSlot.jsx

import React, { useState } from "react";
import { Clock, Plus } from "lucide-react";

const AddTimeSlot = ({ onAddTimeSlot }) => {
	const [showForm, setShowForm] = useState(false);
	const [timeSlot, setTimeSlot] = useState("");
	const [timeFrom, setTimeFrom] = useState("");
	const [timeTo, setTimeTo] = useState("");
	const [planName, setPlanName] = useState("");

	const handleSubmit = () => {
		if (timeFrom && timeTo && planName.trim()) {
			const formattedTimeSlot = `${planName.trim()} (${timeFrom} - ${timeTo})`;
			onAddTimeSlot(formattedTimeSlot);
			resetForm();
		} else if (timeSlot.trim()) {
			onAddTimeSlot(timeSlot.trim());
			resetForm();
		}
	};

	const resetForm = () => {
		setTimeSlot("");
		setTimeFrom("");
		setTimeTo("");
		setPlanName("");
		setShowForm(false);
	};

	if (!showForm) {
		return (
			<div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-indigo-400 transition-colors">
				<button
					onClick={() => setShowForm(true)}
					className="flex items-center justify-center space-x-2 w-full text-gray-600 hover:text-indigo-600 transition-colors"
				>
					<Plus className="w-5 h-5" />
					<span className="font-medium">Add Time Slot</span>
				</button>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
			<div className="space-y-4">
				<div className="flex items-center space-x-2 mb-4">
					<Clock className="w-4 h-4 text-indigo-600" />
					<span className="font-medium text-gray-700">New Time Slot</span>
				</div>

				{/* Structured Input */}
				<div className="space-y-3">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
						<input
							type="text"
							value={planName}
							onChange={(e) => setPlanName(e.target.value)}
							placeholder="e.g., Morning Study, Lunch Break"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">From</label>
							<input
								type="time"
								value={timeFrom}
								onChange={(e) => setTimeFrom(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">To</label>
							<input
								type="time"
								value={timeTo}
								onChange={(e) => setTimeTo(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
							/>
						</div>
					</div>
				</div>

				{/* OR divider */}
				<div className="flex items-center space-x-3">
					<div className="flex-1 h-px bg-gray-300"></div>
					<span className="text-sm text-gray-500">OR</span>
					<div className="flex-1 h-px bg-gray-300"></div>
				</div>

				{/* Free text input */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Custom Time Slot</label>
					<input
						type="text"
						value={timeSlot}
						onChange={(e) => setTimeSlot(e.target.value)}
						placeholder="e.g., 2:30 PM, Evening Walk"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div className="flex space-x-2 pt-2">
					<button
						onClick={handleSubmit}
						className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
					>
						Add Time Slot
					</button>
					<button
						onClick={resetForm}
						className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-400 transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddTimeSlot;
