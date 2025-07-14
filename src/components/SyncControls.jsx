import React, { useState, useRef, useEffect } from "react";
import storage from "../utils/storage";
import { Settings, Loader2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const SyncControls = ({ onPlannerLoad }) => {
	const { theme } = useTheme();
	const [open, setOpen] = useState(false);
	const [canSync, setCanSync] = useState(true);
	const [timeLeft, setTimeLeft] = useState(0);
	const [isServerReady, setIsServerReady] = useState(false);
	const menuRef = useRef(null);

	const SYNC_INTERVAL = 60 * 60 * 1000; // 1 hour in ms

	const pingServer = async () => {
		try {
			const res = await fetch("https://self-planner-backend.onrender.com/api/health");
			if (res.ok) {
				setIsServerReady(true);
			} else {
				throw new Error("Health check failed");
			}
		} catch {
			console.warn("Server not ready, retrying in 3s...");
			setTimeout(pingServer, 3000);
		}
	};

	useEffect(() => {
		pingServer();
		const last = parseInt(localStorage.getItem("lastSyncTime") || "0", 10);
		const now = Date.now();
		const remaining = SYNC_INTERVAL - (now - last);
		if (remaining > 0) {
			setCanSync(false);
			setTimeLeft(Math.ceil(remaining / 1000));
		}
	}, []);

	useEffect(() => {
		if (!canSync && timeLeft > 0) {
			const interval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						setCanSync(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [canSync, timeLeft]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSync = async () => {
		if (!canSync) {
			alert(`Please wait ${Math.ceil(timeLeft / 60)} more minutes to sync.`);
			return;
		}
		const user = storage.getCurrentUser();
		if (!user) return alert("No user logged in.");

		const dates = storage.getAllPlannerDates(user.id);
		const planner = dates.reduce((acc, date) => {
			const dayData = storage.getPlannerData(user.id, date);
			acc[date] = dayData;
			return acc;
		}, {});

		const fullUserData = { user, planner };

		try {
			const res = await fetch("https://self-planner-backend.onrender.com/api/sync", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(fullUserData),
			});
			const data = await res.json();
			alert("Data synced with server.");
			console.log("Sync Success:", data);

			localStorage.setItem("lastSyncTime", Date.now().toString());
			setCanSync(false);
			setTimeLeft(Math.ceil(SYNC_INTERVAL / 1000));
		} catch (error) {
			console.error("Sync Error:", error);
			alert("Sync failed.");
		}
	};

	const handleLoad = async () => {
		const user = storage.getCurrentUser();
		if (!user) return alert("No user logged in.");

		try {
			const res = await fetch(`https://self-planner-backend.onrender.com/api/planner/${user.id}`);
			if (!res.ok) throw new Error("No planner found on server");

			const planner = await res.json();
			Object.entries(planner).forEach(([date, data]) => {
				storage.savePlannerData(user.id, date, data);
			});

			alert("Planner loaded from server.");
			if (onPlannerLoad) onPlannerLoad();
			window.location.reload();
		} catch (error) {
			console.error("Load Error:", error);
			alert("Failed to load planner.");
		}
	};

	const formatTime = (seconds) => {
		const min = Math.floor(seconds / 60);
		const sec = seconds % 60;
		return `${min}m ${sec}s`;
	};

	return (
		<div className="relative inline-block text-left" ref={menuRef}>
			<button
				onClick={() => {
					setOpen((prev) => !prev);
					if (!isServerReady) pingServer();
				}}
				className={`p-2 rounded-full transition-colors ${theme.colors.backgroundSecondary} ${theme.colors.shadow} ${theme.colors.text} hover:opacity-90`}
				title={isServerReady ? "Sync Settings" : "Waking up server..."}
				disabled={!isServerReady && !open}
			>
				{isServerReady ? <Settings size={20} /> : <Loader2 size={20} className="animate-spin" />}
			</button>

			{open && (
				<div
					className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50 ${theme.colors.background} ${theme.colors.border}`}
				>
					<button
						onClick={handleSync}
						className={`block w-full text-left px-4 py-2 rounded-t-lg ${
							canSync
								? `hover:${theme.colors.hoverBg} ${theme.colors.text}`
								: `cursor-not-allowed ${theme.colors.textSecondary}`
						}`}
						disabled={!canSync}
					>
						{canSync ? "Save in Server" : `Wait: ${formatTime(timeLeft)}`}
					</button>
					<button
						onClick={handleLoad}
						className={`block w-full text-left px-4 py-2 rounded-b-lg hover:${theme.colors.hoverBg} ${theme.colors.text}`}
					>
						Load from Server
					</button>
				</div>
			)}
		</div>
	);
};

export default SyncControls;
