import Link from "next/link";
import { fetchProjects } from "@/lib/drupal";
import { notFound } from "next/navigation";

type Project = Awaited<ReturnType<typeof fetchProjects>>[0];

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
	const { category } = await params;
	const allProjects: Project[] = await fetchProjects();

	// Build category list from data
	const allCategories = Array.from(new Set(allProjects.flatMap((p) => p.categories || [])));

	let categoryName: string;
	if (category === "all") {
		categoryName = "All Projects";
	} else {
		const matched = allCategories.find((c) => c.toLowerCase().replace(/\s+/g, "-") === category);
		if (!matched) return notFound();
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
						<Link key={p.id} href={`/projects/${p.slug}`} className="block border border-[var(--card-border)] hover:shadow-md transition-shadow overflow-hidden bg-[var(--card-bg)]">
							<div className="h-40 flex items-center justify-center overflow-hidden">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								{p.image?.url ? (
									<img src={p.image.url} alt={p.image.alt ?? p.title} className="h-full w-full object-cover" />
								) : (
									<span className="text-sm text-responsive">No image</span>
								)}
							</div>
							<div className="p-4">
								<h3 className="font-medium truncate text-responsive">{p.title}</h3>
								{p.categories?.length ? (
									<div className="mt-2 flex flex-wrap gap-2">
										{p.categories.map((c) => (
											<span key={c} className="text-xs bg-[var(--color-thistle)] text-[var(--color-gunmetal)] px-2 py-1">{c}</span>
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
