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
