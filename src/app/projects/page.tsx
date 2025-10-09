"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
	id: string;
	slug: string;
	title: string;
	image?: { url: string; alt?: string };
	categories?: string[];
}

export default function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadProjects() {
			try {
				const response = await fetch('/api/projects');
				const data = await response.json();
				setProjects(data);
      } catch (error) {
			} finally {
				setLoading(false);
			}
		}
		loadProjects();
	}, []);

	// Get unique categories from all projects
	const allCategories = Array.from(
		new Set(projects.flatMap((p) => p.categories || []))
	);

	if (loading) {
		return (
			<section className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-semibold mb-8 text-responsive">Projects</h1>
				<div className="text-center py-8">
					<div className="text-responsive">Loading...</div>
				</div>
			</section>
		);
	}

	return (
		<section className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-semibold mb-8 text-responsive">Projects</h1>
			
			<div className="split-layout">
				{/* Left side - Categories */}
				<div className="split-left">
					<h2 className="text-xl font-medium mb-6 text-responsive">Categories</h2>
					<div className="space-y-3">
						{/* All Categories Card */}
						<Link
							href="/projects/category/all"
							className="block p-4 border border-[var(--card-border)] hover:border-[var(--accent)] hover:shadow-lg transition-all duration-200 bg-[var(--card-bg)]"
						>
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-gradient-to-br from-[var(--color-gunmetal)] to-[var(--color-paynes_gray)] flex items-center justify-center">
									<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
										<path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
									</svg>
								</div>
								<div>
							<div className="font-medium text-responsive">All Projects</div>
							<div className="text-sm text-responsive">{projects.length} projects</div>
								</div>
							</div>
						</Link>

						{/* Category Cards */}
						{allCategories.map((category) => {
							const categoryProjects = projects.filter((p) => p.categories?.includes(category));
							const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
							return (
								<Link
									key={category}
									href={`/projects/category/${categorySlug}`}
									className="block p-4 border border-[var(--card-border)] hover:border-[var(--accent)] hover:shadow-lg transition-all duration-200 bg-[var(--card-bg)]"
								>
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--color-thistle)] flex items-center justify-center">
											<span className="text-white font-bold text-lg">{category.charAt(0)}</span>
										</div>
										<div>
											<div className="font-medium text-responsive">{category}</div>
											<div className="text-sm text-responsive">{categoryProjects.length} projects</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>

				{/* Right side - Featured Project */}
				<div className="split-right">
					<h2 className="text-xl font-medium mb-6 text-responsive">Featured</h2>
					{projects.length > 0 ? (
						<div className="bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-sm">
							{projects[0].image?.url ? (
								<div className="h-48 overflow-hidden">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img 
										src={projects[0].image.url} 
										alt={projects[0].image.alt ?? projects[0].title} 
										className="w-full h-full object-cover" 
									/>
								</div>
							) : (
								<div className="h-48 bg-gradient-to-br from-[var(--color-thistle)] to-[var(--accent)] flex items-center justify-center">
									<span className="text-[var(--color-gunmetal)] text-lg font-medium">No image</span>
								</div>
							)}
							<div className="p-6">
								<h3 className="text-xl font-semibold text-responsive mb-2">{projects[0].title}</h3>
								{projects[0].categories?.length ? (
									<div className="mb-3 flex flex-wrap gap-2">
										{projects[0].categories.map((c) => (
												<span key={c} className="text-xs bg-[var(--color-thistle)] text-[var(--color-gunmetal)] px-2 py-1">
													{c}
												</span>
										))}
									</div>
								) : null}
								<Link 
									href={`/projects/${projects[0].slug}?from=projects`}
									className="inline-flex items-center text-[var(--accent)] hover:text-responsive font-medium transition-colors"
								>
									View Project →
								</Link>
							</div>
						</div>
					) : (
						<div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 text-center">
							<p className="text-responsive">No projects available</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
