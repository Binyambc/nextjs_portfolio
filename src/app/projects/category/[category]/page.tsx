"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Project {
	id: string;
	slug: string;
	title: string;
	image?: { url: string; alt?: string };
	categories?: string[];
}

export default function CategoryPage() {
	const params = useParams();
	const category = params.category as string;
	const [allProjects, setAllProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadProjects() {
			try {
				const response = await fetch('/api/projects');
				const data = await response.json();
				setAllProjects(data);
			} catch (error) {
			} finally {
				setLoading(false);
			}
		}
		loadProjects();
	}, []);

	// Build category list from data
	const allCategories = Array.from(new Set(allProjects.flatMap((p) => p.categories || [])));

	if (loading) {
		return (
			<section className="container mx-auto px-4 py-8">
				<div className="text-center py-8">
					<div className="text-responsive">Loading...</div>
				</div>
			</section>
		);
	}

	let categoryName: string;
	if (category === "all") {
		categoryName = "All Projects";
	} else {
		const matched = allCategories.find((c) => c.toLowerCase().replace(/\s+/g, "-") === category);
		if (!matched) {
			return (
				<section className="container mx-auto px-4 py-8">
					<div className="text-center py-8">
						<h1 className="text-2xl font-semibold mb-4 text-responsive">Category Not Found</h1>
						<Link href="/projects" className="text-[var(--accent)] hover:text-responsive">
							← Back to Projects
						</Link>
					</div>
				</section>
			);
		}
		categoryName = matched;
	}

	const filteredProjects = categoryName === "All Projects"
		? allProjects
		: allProjects.filter((p) => p.categories?.includes(categoryName));

	return (
		<section>
			<div className="mb-4">
				<Link href="/projects" className="text-[var(--accent)] hover:text-responsive">
					← 
				</Link>
			</div>

			<h1 className="text-xl font-semibold mb-6 text-responsive">
				{categoryName} ({filteredProjects.length} projects)
			</h1>

			{filteredProjects.length === 0 ? (
				<div className="text-center py-8 text-responsive">No projects found in this category.</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredProjects.map((p) => (
						<Link key={p.id} href={`/projects/${p.slug}?from=category&category=${encodeURIComponent(category)}`} className="block border border-[var(--card-border)] hover:shadow-md transition-shadow overflow-hidden bg-[var(--card-bg)]">
							<div className="h-40 flex items-center justify-center overflow-hidden">
								{p.image?.url ? (
									<Image src={p.image.url} alt={p.image.alt ?? p.title} width={300} height={160} className="h-full w-full object-cover" />
								) : (
									<span className="text-sm text-responsive">No image</span>
								)}
							</div>
							<div className="p-4">
								<h3 className="font-medium truncate text-responsive">{p.title}</h3>
								{p.categories?.length ? (
									<div className="mt-2 flex flex-wrap gap-2">
										{p.categories.map((c) => (
													<span key={c} className="text-xs bg-[var(--color-thistle)] text-[var(--color-gunmetal)] px-2 py-1">
														{c}
													</span>
										))}
									</div>
								) : null}
							</div>
						</Link>
					))}
				</div>
			)}
		</section>
	);
}
