import { fetchAllPages, fetchPageBySlug } from "@/lib/drupal";

export async function generateStaticParams() {
	const pages = await fetchAllPages();
	return pages.map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const page = await fetchPageBySlug(slug);
	if (!page) {
		return <div className="p-8">Not found</div>;
	}
	return (
		<article className="split-layout">
			{/* Left side with image */}
			<div className="split-left flex justify-center items-center">
				{page.image?.url ? (
					<div className="w-40 h-40 rounded-full border-5 border-[var(--border)] p-[2px]">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={page.image.url}
							alt={page.image.alt ?? page.title}
							className="w-full h-full rounded-full object-cover object-top"
						/>
					</div>
				) : null}
			</div>

			{/* Divider */}
			<div className="divider" aria-hidden="true"></div>

			{/* Right side with content */}
			<div className="split-right prose flex flex-col justify-center">
				<div dangerouslySetInnerHTML={{ __html: page.html ?? "" }} />
			</div>
		</article>
	);
}
