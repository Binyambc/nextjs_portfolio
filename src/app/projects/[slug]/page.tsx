import Link from "next/link";
import { fetchProjectBySlug } from "@/lib/drupal";
import ImageGallery from "@/app/_components/ImageGallery";

// Allow dynamic project slugs without pre-generating paths
export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const project = await fetchProjectBySlug(slug);
	if (!project) {
		return <div className="p-8">Not found</div>;
	}
	return (
		<div className="container mx-auto px-4 py-8">
			{/* Back Arrow */}
			<div className="mb-6">
				<Link 
					href="/projects" 
					className="inline-flex items-center text-[var(--accent)] hover:text-responsive font-medium transition-colors"
				>
					<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					Back to Projects
				</Link>
			</div>

			{/* Project Card */}
			<div className="max-w-6xl mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
					{/* Image Gallery - Left Side */}
					<ImageGallery 
						images={project.images || (project.image ? [project.image] : [])} 
						title={project.title} 
					/>

					{/* Content - Right Side */}
					<div className="p-8 flex flex-col justify-center">
						{/* Title */}
						<h1 className="text-3xl font-semibold mb-4 text-responsive">{project.title}</h1>
						
						{/* Categories */}
						{project.categories?.length ? (
							<div className="mb-6 flex flex-wrap gap-2">
								{project.categories.map((c) => (
									<span key={c} className="text-sm bg-[var(--color-thistle)] text-[var(--color-gunmetal)] px-3 py-1">
										{c}
									</span>
								))}
							</div>
						) : null}

						{/* Body Text */}
						<div
							className="text-responsive leading-relaxed prose prose-lg max-w-none"
							dangerouslySetInnerHTML={{ __html: project.html ?? "" }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
