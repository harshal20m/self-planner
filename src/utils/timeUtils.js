// src/utils/timeUtils.js

export const parseTimeForSorting = (timeString) => {
	const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
	if (!timeMatch) return 9999;

	let hours = parseInt(timeMatch[1]);
	const minutes = parseInt(timeMatch[2]);
	const period = timeMatch[3].toUpperCase();

	if (period === "AM" && hours === 12) hours = 0;
	if (period === "PM" && hours !== 12) hours += 12;

	return hours * 60 + minutes;
};

export const convertTo12HourFormat = (timeRange) => {
	const format = (timeStr) => {
		const [hourStr, minuteStr] = timeStr.trim().split(":");
		let hour = parseInt(hourStr);
		const minute = minuteStr.padStart(2, "0");
		const ampm = hour >= 12 ? "PM" : "AM";
		hour = hour % 12 || 12;
		return `${hour}:${minute} ${ampm}`;
	};

	// Match times in parentheses, e.g., (16:00 - 18:00)
	const match = timeRange.match(/\((\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\)/);
	if (!match) return timeRange;

	const [_, start, end] = match;
	const formatted = `${format(start)} - ${format(end)}`;

	return timeRange.replace(/\((.*?)\)/, `(${formatted})`);
};
