"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const navigationItems = [
	{ title: "Home", href: "/" },
	{ title: "Projects", href: "/projects" },
	{ title: "About", href: "/about" },
	{ title: "Contact", href: "/contact" }
];

export default function Navigation() {

	return (
		<nav className="max-w-4xl mx-auto flex items-center justify-between p-4 text-sm">
			<div className="flex gap-4">
				{navigationItems.map((item) => (
					<Link key={item.href + item.title} href={item.href} className="nav-link">
						{item.title}
					</Link>
				))}
			</div>
			<ThemeToggle />
		</nav>
	);
}
