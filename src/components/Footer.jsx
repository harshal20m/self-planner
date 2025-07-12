// src/components/Footer.jsx

import React from "react";

const Footer = () => {
	return (
		<footer className="mt-10 border-t pt-6 pb-6 text-center text-sm text-gray-500">
			<p>
				Made with ❤️ by{" "}
				<a
					href="https://harshalmali.online"
					target="_blank"
					rel="noopener noreferrer"
					className="text-indigo-600 hover:underline"
				>
					&lt; HM /&gt;
				</a>
			</p>
		</footer>
	);
};

export default Footer;
