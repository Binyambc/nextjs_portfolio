export type JsonApiResponse<T> = {
	data: Array<{
		id: string;
		type: string;
		attributes: T & Record<string, unknown>;
		relationships?: Record<string, { data?: unknown }>;
	}>;
	included?: Array<{
		id: string;
		type: string;
		attributes: Record<string, unknown>;
	}>;
};

function getBaseUrl(): string {
	const base = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;
	if (!base) {
		throw new Error(
			"Missing NEXT_PUBLIC_DRUPAL_BASE_URL. Add it to .env.local (e.g., https://your-drupal-site.com)."
		);
	}
	return base.replace(/\/$/, "");
}

function getAuthHeader(): Record<string, string> {
	const user = process.env.DRUPAL_JSONAPI_USERNAME;
	const pass = process.env.DRUPAL_JSONAPI_PASSWORD;
	if (user && pass) {
		const token = Buffer.from(`${user}:${pass}`).toString("base64");
		return { Authorization: `Basic ${token}` };
	}
	return {};
}

async function jsonApiFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
	const url = `${getBaseUrl()}${endpoint}`;
	const res = await fetch(url, {
		next: { revalidate: 60 },
		headers: {
			Accept: "application/vnd.api+json",
			"Content-Type": "application/vnd.api+json",
			...getAuthHeader(),
		},
		...init,
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Drupal request failed: ${res.status} ${res.statusText} — ${text}`);
	}
	return (await res.json()) as T;
}

function extractHtmlFromAttributes(attrs: Record<string, unknown>): string | undefined {
	// Prefer the standard body field
	const body = attrs?.body as { processed?: string; value?: string } | undefined;
	if (body?.processed || body?.value) {
		return body.processed ?? body.value;
	}
	// Fall back to common custom rich text field names
	const candidateKeys = ["field_body", "field_content", "field_text", "field_description"];
	for (const key of candidateKeys) {
		const val = attrs?.[key] as { processed?: string; value?: string } | undefined;
		if (val?.processed || val?.value) return val.processed ?? val.value;
	}
	// Last resort: find the first attribute that looks like a text-with-summary field
	for (const [k, v] of Object.entries(attrs)) {
		if (v && typeof v === "object" && ("processed" in v || "value" in v)) {
			const processed = (v as { processed?: string; value?: string }).processed ?? (v as { processed?: string; value?: string }).value;
			if (typeof processed === "string") return processed;
		}
	}
	return undefined;
}

function indexIncluded(included?: Array<{ id: string; type: string; attributes: Record<string, unknown> }>): Record<string, { attributes: Record<string, unknown> }> {
	const index: Record<string, { attributes: Record<string, unknown> }> = {};
	if (included) {
		for (const item of included) {
			index[`${item.type}:${item.id}`] = { attributes: item.attributes };
		}
	}
	return index;
}

function resolveSingleRelationship(node: DrupalNode, fieldName: string): { type: string; id: string; meta?: Record<string, unknown> } | null {
	const rel = node?.relationships?.[fieldName]?.data;
	if (!rel) return null;
	if (Array.isArray(rel)) return (rel[0] as { type: string; id: string; meta?: Record<string, unknown> }) || null;
	return rel as { type: string; id: string; meta?: Record<string, unknown> };
}

function resolveImageFromNode(node: DrupalNode, includedIndex: Record<string, { attributes: Record<string, unknown> }>): { url: string; alt?: string } | undefined {
	const fileRef = resolveSingleRelationship(node, "field_image");
	if (!fileRef) return undefined;
	const included = includedIndex[`${fileRef.type}:${fileRef.id}`];
	const url = (included?.attributes as { uri?: { url?: string } })?.uri?.url;
	const alt: string | undefined = (fileRef as { meta?: { alt?: string } })?.meta?.alt;
	if (typeof url === "string") {
		const absoluteUrl = url.startsWith("http") ? url : `${getBaseUrl()}${url}`;
		return { url: absoluteUrl, alt };
	}
	return undefined;
}

function resolveAllImagesFromNode(node: DrupalNode, includedIndex: Record<string, { attributes: Record<string, unknown> }>): { url: string; alt?: string }[] {
	const rel = node?.relationships?.field_image?.data;
	if (!rel) return [];
	
	const items = Array.isArray(rel) ? rel : [rel];
	const images: { url: string; alt?: string }[] = [];
	
	for (const item of items) {
		const included = includedIndex[`${item.type}:${item.id}`];
		const url = (included?.attributes as { uri?: { url?: string } })?.uri?.url;
		const alt: string | undefined = (item as { meta?: { alt?: string } })?.meta?.alt;
		if (typeof url === "string") {
			const absoluteUrl = url.startsWith("http") ? url : `${getBaseUrl()}${url}`;
			images.push({ url: absoluteUrl, alt });
		}
	}
	
	return images;
}

function resolveCategoriesFromNode(node: DrupalNode, includedIndex: Record<string, { attributes: Record<string, unknown> }>): string[] {
	const catRel = node?.relationships?.field_category?.data;
	if (!catRel) return [];
	
	const items = Array.isArray(catRel) ? catRel : [catRel];
	const categories: string[] = [];
	
	for (const item of items) {
		const included = includedIndex[`${item.type}:${item.id}`];
		const name = (included?.attributes as { name?: string })?.name;
		if (typeof name === "string") {
			categories.push(name);
		}
	}
	
	return categories;
}

export type PageAttributes = {
	title: string;
	body?: { value?: string; processed?: string };
	field_slug?: string;
} & Record<string, any>;

export type ProjectAttributes = {
	title: string;
	body?: { value?: string; processed?: string };
	field_slug?: string;
	field_category?: string;
} & Record<string, any>;

type DrupalNode = {
	id: string;
	type: string;
	attributes: Record<string, unknown>;
	relationships?: Record<string, { data?: unknown }>;
};

export async function fetchAllPages(): Promise<Array<{ id: string; slug: string; title: string }>> {
	const json = await jsonApiFetch<JsonApiResponse<PageAttributes>>(
		"/jsonapi/node/pages"
	);
	return json.data
		.map((n) => ({ id: n.id, slug: (n.attributes as { field_slug?: string }).field_slug, title: n.attributes.title }))
		.filter((n): n is { id: string; slug: string; title: string } => !!n.slug);
}

export async function fetchPageBySlug(slug: string): Promise<{ title: string; html?: string; image?: { url: string; alt?: string } } | null> {
	const json = await jsonApiFetch<JsonApiResponse<PageAttributes>>(
		`/jsonapi/node/pages?filter[field_slug][value]=${encodeURIComponent(slug)}&include=field_image`
	);
	const node = json.data[0] as DrupalNode;
	if (!node) return null;
	const includedIndex = indexIncluded(json.included);
	const html = extractHtmlFromAttributes(node.attributes);
	const image = resolveImageFromNode(node, includedIndex);
	return { title: (node.attributes as { title: string }).title, html, image };
}

export async function fetchProjects(): Promise<Array<{ id: string; slug: string; title: string; image?: { url: string; alt?: string }; categories?: string[] }>> {
	const json = await jsonApiFetch<JsonApiResponse<ProjectAttributes>>(
		"/jsonapi/node/projects?include=field_image,field_category"
	);
	const includedIndex = indexIncluded(json.included);
	return json.data
		.map((node: DrupalNode) => {
			const slug = (node?.attributes as { field_slug?: string })?.field_slug;
			if (!slug) return null;
			const image = resolveImageFromNode(node, includedIndex);
			const categories = resolveCategoriesFromNode(node, includedIndex);
			return { 
				id: node.id, 
				slug, 
				title: (node.attributes as { title: string }).title,
				image,
				categories
			};
		})
		.filter((n: any): n is NonNullable<typeof n> => !!n);
}

export async function fetchProjectBySlug(slug: string): Promise<{ title: string; html?: string; image?: { url: string; alt?: string }; images?: { url: string; alt?: string }[]; categories?: string[] } | null> {
	const json = await jsonApiFetch<JsonApiResponse<ProjectAttributes>>(
		`/jsonapi/node/projects?filter[field_slug][value]=${encodeURIComponent(slug)}&include=field_image,field_category`
	);
	const node = json.data[0] as DrupalNode;
	if (!node) return null;
	const includedIndex = indexIncluded(json.included);
	const html = extractHtmlFromAttributes(node.attributes);
	const image = resolveImageFromNode(node, includedIndex);
	const images = resolveAllImagesFromNode(node, includedIndex);
	const categories = resolveCategoriesFromNode(node, includedIndex);
	return { 
		title: (node.attributes as { title: string }).title, 
		html, 
		image,
		images,
		categories
	};
}

export type MenuLinkAttributes = {
	title: string;
	url: { uri: string } | string;
	weight?: number;
	link?: { uri?: string } | string;
};

async function resolveNodePathToSlug(href: string): Promise<string | null> {
	// Matches /node/123
	const m = href.match(/^\/node\/(\d+)/);
	if (!m) return null;
	const nid = m[1];
	// Try pages first
	try {
		const p = await jsonApiFetch<JsonApiResponse<PageAttributes>>(
			`/jsonapi/node/pages?filter[drupal_internal__nid][value]=${nid}`
		);
		const slug = p.data?.[0]?.attributes?.field_slug;
		if (slug) return `/${slug}`;
	} catch {}
	// Try projects
	try {
		const p = await jsonApiFetch<JsonApiResponse<ProjectAttributes>>(
			`/jsonapi/node/projects?filter[drupal_internal__nid][value]=${nid}`
		);
		const slug = p.data?.[0]?.attributes?.field_slug;
		if (slug) return `/projects/${slug}`;
	} catch {}
	return null;
}

export async function fetchMenu(menuId = "main"): Promise<Array<{ title: string; href: string; weight: number }>> {
	const endpoints = [
		`/jsonapi/menu_link_content/${menuId}`,
		`/jsonapi/menu_items/${menuId}`,
	];

	for (const endpoint of endpoints) {
		try {
			const json = await jsonApiFetch<any>(endpoint);
			const items: Array<{ title: string; href: string; weight: number }> = [];
			if (Array.isArray(json?.data)) {
				for (const item of json.data) {
					const attrs: MenuLinkAttributes & { parent?: string; enabled?: boolean } = item.attributes || ({} as any);
					// Only top-level items: parent is empty/null or starts with 'menu:' (root)
					const parent: string | undefined = (attrs as any).parent;
					const isTopLevel = !parent || parent.startsWith("menu:");
					const isEnabled = (attrs as any).enabled !== false;
					if (!isTopLevel || !isEnabled) continue;

					const rawUrl = (attrs.url as any)?.uri || (attrs.link as any)?.uri || (attrs.url as any) || (attrs.link as any);
					let href = typeof rawUrl === "string" ? rawUrl : undefined;
					if (!href) continue;
					if (href.startsWith("internal:")) href = href.replace(/^internal:/, "");
					if (href.startsWith("entity:node/")) {
						href = href.replace("entity:", "");
					}
					if (/^\/node\//.test(href)) {
						const resolved = await resolveNodePathToSlug(href);
						if (resolved) href = resolved;
					}
					items.push({
						title: (attrs as any).title || (attrs as any).label || "",
						href,
						weight: typeof attrs.weight === "number" ? attrs.weight : 0,
					});
				}
			}
			if (items.length) {
				return items.sort((a, b) => a.weight - b.weight);
			}
		} catch {}
	}
	return [];
}
