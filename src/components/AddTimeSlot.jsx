import React, { useState } from "react";
import { Clock, Plus } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext"; // Import useTheme

const AddTimeSlot = ({ onAddTimeSlot }) => {
	const { theme } = useTheme(); // Use the theme hook
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
			<div
				className={`${theme.colors.cardBg} rounded-lg border-2 border-dashed ${theme.colors.borderInput} p-6 text-center hover:${theme.colors.borderHover} transition-colors`}
			>
				<button
					onClick={() => setShowForm(true)}
					className={`flex items-center justify-center space-x-2 w-full ${theme.colors.textSecondary} ${theme.colors.primaryTextHover} transition-colors`}
				>
					<Plus className="w-5 h-5" />
					<span className="font-medium">Add Time Slot</span>
				</button>
			</div>
		);
	}

	return (
		<div className={`${theme.colors.cardBg} rounded-lg ${theme.colors.border} p-4 ${theme.colors.shadow}`}>
			<div className="space-y-4">
				<div className="flex items-center space-x-2 mb-4">
					<Clock className={`w-4 h-4 ${theme.colors.primaryText}`} />
					<span className={`font-medium ${theme.colors.text}`}>New Time Slot</span>
				</div>

				{/* Structured Input */}
				<div className="space-y-3">
					<div>
						<label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1`}>
							Plan Name
						</label>
						<input
							type="text"
							value={planName}
							onChange={(e) => setPlanName(e.target.value)}
							placeholder="e.g., Morning Study, Lunch Break"
							className={`w-full px-3 py-2 border ${theme.colors.borderInput} rounded-lg focus:ring-2 ${theme.colors.ring} focus:border-transparent ${theme.colors.inputBg} ${theme.colors.text}`}
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1`}>
								From
							</label>
							<input
								type="time"
								value={timeFrom}
								onChange={(e) => setTimeFrom(e.target.value)}
								className={`w-full px-3 py-2 border ${theme.colors.borderInput} rounded-lg focus:ring-2 ${theme.colors.ring} focus:border-transparent ${theme.colors.inputBg} ${theme.colors.text}`}
							/>
						</div>
						<div>
							<label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1`}>To</label>
							<input
								type="time"
								value={timeTo}
								onChange={(e) => setTimeTo(e.target.value)}
								className={`w-full px-3 py-2 border ${theme.colors.borderInput} rounded-lg focus:ring-2 ${theme.colors.ring} focus:border-transparent ${theme.colors.inputBg} ${theme.colors.text}`}
							/>
						</div>
					</div>
				</div>

				{/* OR divider */}
				<div className="flex items-center space-x-3">
					<div className={`flex-1 h-px ${theme.colors.borderInput}`}></div>
					<span className={`text-sm ${theme.colors.textMuted}`}>OR</span>
					<div className={`flex-1 h-px ${theme.colors.borderInput}`}></div>
				</div>

				{/* Free text input */}
				<div>
					<label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1`}>
						Custom Time Slot
					</label>
					<input
						type="text"
						value={timeSlot}
						onChange={(e) => setTimeSlot(e.target.value)}
						placeholder="e.g., 2:30 PM, Evening Walk"
						className={`w-full px-3 py-2 border ${theme.colors.borderInput} rounded-lg focus:ring-2 ${theme.colors.ring} focus:border-transparent ${theme.colors.inputBg} ${theme.colors.text}`}
					/>
				</div>

				<div className="flex space-x-2 pt-2">
					<button
						onClick={handleSubmit}
						className={`${theme.colors.primary} text-white px-4 py-2 rounded-lg text-sm ${theme.colors.primaryHover} transition-colors`}
					>
						Add Time Slot
					</button>
					<button
						onClick={resetForm}
						className={`${theme.colors.progressBg} ${theme.colors.textSecondary} px-4 py-2 rounded-lg text-sm hover:${theme.colors.borderInput} transition-colors`}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddTimeSlot;
