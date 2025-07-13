import React from "react";
import { useTheme } from "../contexts/ThemeContext"; // Import useTheme

const Footer = () => {
	const { theme } = useTheme(); // Use the theme hook

	return (
		<footer
			className={` border-t ${theme.colors.border} pt-6 pb-6 ${theme.colors.background} font-bold text-center text-sm ${theme.colors.textMuted}`}
		>
			<p>
				Made with 💖 by{" "}
				<a
					href="https://harshalmali.online"
					target="_blank"
					rel="noopener noreferrer"
					className={`${theme.colors.primaryText} ${theme.colors.primaryTextHover} hover:underline`}
				>
					&lt; HM /&gt;
				</a>
			</p>
		</footer>
	);
};

export default Footer;
