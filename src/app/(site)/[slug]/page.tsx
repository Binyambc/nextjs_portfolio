"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import SafeHTML from "@/app/_components/SafeHTML";

interface PageData {
	title: string;
	html?: string;
	image?: { url: string; alt?: string };
}

export default function Page() {
	const params = useParams();
	const slug = params.slug as string;
	const [page, setPage] = useState<PageData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadPage() {
			try {
				const response = await fetch(`/api/pages/${slug}`);
				if (response.ok) {
					const data = await response.json();
					setPage(data);
				}
			} catch (error) {
			} finally {
				setLoading(false);
			}
		}
		loadPage();
	}, [slug]);

	if (loading) {
		return (
			<section className="container mx-auto px-4 py-8">
				<div className="text-center py-8">
					<div className="text-responsive">Loading...</div>
				</div>
			</section>
		);
	}

	if (!page) {
		return <div className="p-8">Not found</div>;
	}
	return (
		<article className="split-layout">
			{/* Left side with image */}
			<div className="split-left flex justify-center items-center">
				{page.image?.url ? (
					<div className="w-40 h-40 rounded-full border-5 border-[var(--border)] p-[2px]">
						<Image
							src={page.image.url}
							alt={page.image.alt ?? page.title}
							width={160}
							height={160}
							className="w-full h-full rounded-full object-cover object-top"
						/>
					</div>
				) : null}
			</div>

			{/* Divider */}
			<div className="divider" aria-hidden="true"></div>

			{/* Right side with content */}
			<div className="split-right prose flex flex-col justify-center">
				<SafeHTML html={page.html ?? ""} />
			</div>
		</article>
	);
}
