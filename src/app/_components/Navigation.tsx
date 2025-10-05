import Link from "next/link";
import { fetchMenu, fetchAllPages } from "@/lib/drupal";
import ThemeToggle from "./ThemeToggle";

function navRank(href: string, title: string): number {
	const path = href.replace(/\/$/, "") || "/";
	if (path === "/") return 0;
	if (path === "/projects") return 1;
	if (path === "/about") return 2;
	if (path === "/contact") return 3;
	// Unknowns go after the known items
	return 100;
}

export default async function Navigation({ menuId = "main" }: { menuId?: string }) {
	let items = await fetchMenu(menuId);
	if (!items.length) {
		const pages = await fetchAllPages();
		items = pages
			.filter((p) => ["home", "about", "contact"].includes(p.slug))
			.map((p) => ({ title: p.title, href: p.slug === "home" ? "/" : `/${p.slug}`, weight: 0 }));
	}

	// Ensure Projects link is present even if not provided by menu
	const hasProjects = items.some((i) => i.href === "/projects" || i.href.startsWith("/projects/"));
	if (!hasProjects) {
		items.push({ title: "Projects", href: "/projects", weight: 999 });
	}

	// Order: Home, Projects, About, Contact, then others by weight/title
	items = items
		.reduce((acc, item) => {
			// de-dupe by href
			if (!acc.some((i) => i.href === item.href)) acc.push(item);
			return acc;
		}, [] as typeof items)
		.sort((a, b) => {
			const r = navRank(a.href, a.title) - navRank(b.href, b.title);
			if (r !== 0) return r;
			const w = (a.weight ?? 0) - (b.weight ?? 0);
			if (w !== 0) return w;
			return a.title.localeCompare(b.title);
		});

	return (
		<nav className="max-w-4xl mx-auto flex items-center justify-between p-4 text-sm">
			<div className="flex gap-4">
				{items.map((item) => (
					<Link key={item.href + item.title} href={item.href} className="nav-link">
						{item.title}
					</Link>
				))}
			</div>
			<ThemeToggle />
		</nav>
	);
}
