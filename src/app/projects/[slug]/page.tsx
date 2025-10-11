"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ImageGallery from "@/app/_components/ImageGallery";
import SafeHTML from "@/app/_components/SafeHTML";

interface ProjectData {
	title: string;
	html?: string;
	image?: { url: string; alt?: string };
	images?: { url: string; alt?: string }[];
	categories?: string[];
}

export default function ProjectPage() {
	const params = useParams();
	const router = useRouter();
	const searchParams = useSearchParams();
	const slug = params.slug as string;
	const [project, setProject] = useState<ProjectData | null>(null);
	const [loading, setLoading] = useState(true);
	const [backUrl, setBackUrl] = useState("/projects");

	useEffect(() => {
		const from = searchParams.get('from');
		const category = searchParams.get('category');
		
		if (from === 'category' && category) {
			setBackUrl(`/projects/category/${category}`);
		} else if (from === 'projects') {
			setBackUrl('/projects');
		}

		async function loadProject() {
			try {
				const response = await fetch(`/api/projects/${slug}`);
				if (response.ok) {
					const data = await response.json();
					setProject(data);
				}
			} catch (error) {
			} finally {
				setLoading(false);
			}
		}
		loadProject();
	}, [slug, searchParams]);

	if (loading) {
		return (
			<section className="container mx-auto px-4 py-8">
				<div className="text-center py-8">
					<div className="text-responsive">Loading...</div>
				</div>
			</section>
		);
	}

	if (!project) {
		return <div className="p-8">Not found</div>;
	}
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Link 
					href={backUrl} 
					className="inline-flex items-center text-[var(--accent)] hover:text-responsive font-medium transition-colors"
					aria-label={`Back to ${backUrl.includes('/category/') ? 'Category' : 'Projects'}`}
				>
					<ArrowLeft className="w-5 h-5" />
				</Link>
			</div>

			<div className="max-w-6xl mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
					<ImageGallery 
						images={project.images || (project.image ? [project.image] : [])} 
						title={project.title} 
					/>

					<div className="p-8 flex flex-col justify-center">
						<h1 className="text-3xl font-semibold mb-4 text-responsive">{project.title}</h1>
						
						{project.categories?.length ? (
							<div className="mb-6 flex flex-wrap gap-2">
								{project.categories.map((c) => (
									<span key={c} className="text-sm bg-[var(--color-thistle)] text-[var(--color-gunmetal)] px-3 py-1">
										{c}
									</span>
								))}
							</div>
						) : null}

						<SafeHTML 
							html={project.html ?? ""} 
							className="text-responsive leading-relaxed prose prose-lg max-w-none"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
