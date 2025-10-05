export type JsonApiResponse<T> = {
    data: Array<{
        id: string;
        type: string;
        attributes: T & Record<string, any>;
        relationships?: Record<string, any>;
    }>;
    included?: Array<{
        id: string;
        type: string;
        attributes: Record<string, any>;
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

function extractHtmlFromAttributes(attrs: Record<string, any>): string | undefined {
	// Prefer the standard body field
	if (attrs?.body?.processed || attrs?.body?.value) {
		return attrs.body.processed ?? attrs.body.value;
	}
	// Fall back to common custom rich text field names
	const candidateKeys = ["field_body", "field_content", "field_text", "field_description"];
	for (const key of candidateKeys) {
		const val = attrs?.[key];
		if (val?.processed || val?.value) return val.processed ?? val.value;
	}
	// Last resort: find the first attribute that looks like a text-with-summary field
	for (const [k, v] of Object.entries(attrs)) {
		if (v && typeof v === "object" && ("processed" in v || "value" in v)) {
			const processed = (v as any).processed ?? (v as any).value;
			if (typeof processed === "string") return processed;
		}
	}
	return undefined;
}

export type PageAttributes = {
	title: string;
	body?: { value?: string; processed?: string };
	field_slug?: string;
    field_image?: any;
} & Record<string, any>;

export type ProjectAttributes = {
	title: string;
	body?: { value?: string; processed?: string };
	field_slug?: string;
	field_category?: string;
    field_image?: any;
} & Record<string, any>;

type IncludedIndex = Record<string, { id: string; type: string; attributes: Record<string, any> }>;

function indexIncluded(included?: JsonApiResponse<any>["included"]): IncludedIndex {
    const index: IncludedIndex = {};
    if (!included) return index;
    for (const item of included) {
        index[`${item.type}:${item.id}`] = item as any;
    }
    return index;
}

function resolveSingleRelationship(node: any, fieldName: string): { type: string; id: string; meta?: Record<string, any> } | null {
    const rel = node?.relationships?.[fieldName]?.data;
    if (!rel) return null;
    if (Array.isArray(rel)) return rel[0] || null;
    return rel;
}

function resolveImageFromNode(node: any, includedIndex: IncludedIndex): { url: string; alt?: string } | undefined {
    const fileRef = resolveSingleRelationship(node, "field_image");
    if (!fileRef) return undefined;
    const included = includedIndex[`${fileRef.type}:${fileRef.id}`];
    const url = included?.attributes?.uri?.url;
    const alt: string | undefined = (fileRef as any)?.meta?.alt;
    if (typeof url === "string") {
        const absoluteUrl = url.startsWith("http") ? url : `${getBaseUrl()}${url}`;
        return { url: absoluteUrl, alt };
    }
    return undefined;
}

function resolveAllImagesFromNode(node: any, includedIndex: IncludedIndex): { url: string; alt?: string }[] {
    const rel = node?.relationships?.field_image?.data;
    if (!rel) return [];
    
    const items = Array.isArray(rel) ? rel : [rel];
    const images: { url: string; alt?: string }[] = [];
    
    for (const item of items) {
        const included = includedIndex[`${item.type}:${item.id}`];
        const url = included?.attributes?.uri?.url;
        const alt: string | undefined = (item as any)?.meta?.alt;
        if (typeof url === "string") {
            const absoluteUrl = url.startsWith("http") ? url : `${getBaseUrl()}${url}`;
            images.push({ url: absoluteUrl, alt });
        }
    }
    
    return images;
}

export async function fetchAllPages(): Promise<Array<{ id: string; slug: string; title: string }>> {
	const json = await jsonApiFetch<JsonApiResponse<PageAttributes>>(
		"/jsonapi/node/pages"
	);
	return json.data
		.map((n) => ({ id: n.id, slug: (n.attributes as any).field_slug, title: n.attributes.title }))
		.filter((n) => !!n.slug);
}

export async function fetchPageBySlug(slug: string): Promise<{ title: string; html?: string; image?: { url: string; alt?: string } } | null> {
    const json = await jsonApiFetch<JsonApiResponse<PageAttributes>>(
        `/jsonapi/node/pages?filter[field_slug][value]=${encodeURIComponent(slug)}&include=field_image`
    );
    const node = json.data[0] as any;
    if (!node) return null;
    const includedIndex = indexIncluded(json.included);
    const html = extractHtmlFromAttributes(node.attributes);
    const image = resolveImageFromNode(node, includedIndex);
    return { title: node.attributes.title, html, image };
}

export async function fetchProjects(): Promise<Array<{ id: string; slug: string; title: string; image?: { url: string; alt?: string }; categories?: string[] }>> {
    const json = await jsonApiFetch<JsonApiResponse<ProjectAttributes>>(
        "/jsonapi/node/projects?include=field_image,field_category"
    );
    const includedIndex = indexIncluded(json.included);
    return json.data
        .map((node: any) => {
            const slug = node?.attributes?.field_slug;
            if (!slug) return null;
            const image = resolveImageFromNode(node, includedIndex);
            let categories: string[] | undefined;
            const catRel = node?.relationships?.field_category?.data;
            if (catRel) {
                const items = Array.isArray(catRel) ? catRel : [catRel];
                categories = items
                    .map((r: any) => includedIndex[`${r.type}:${r.id}`]?.attributes?.name)
                    .filter((n: any) => typeof n === "string");
            }
            return {
                id: node.id,
                slug,
                title: node.attributes.title,
                image,
                categories,
            };
        })
        .filter((n: any): n is NonNullable<typeof n> => !!n);
}

export async function fetchProjectBySlug(slug: string): Promise<{
    title: string;
    html?: string;
    image?: { url: string; alt?: string };
    images?: { url: string; alt?: string }[];
    categories?: string[];
} | null> {
    const json = await jsonApiFetch<JsonApiResponse<ProjectAttributes>>(
        `/jsonapi/node/projects?filter[field_slug][value]=${encodeURIComponent(slug)}&include=field_image,field_category`
    );
    const node = json.data[0] as any;
    if (!node) return null;
    const includedIndex = indexIncluded(json.included);
    const html = extractHtmlFromAttributes(node.attributes);
    const image = resolveImageFromNode(node, includedIndex);
    const images = resolveAllImagesFromNode(node, includedIndex);
    let categories: string[] | undefined;
    const catRel = node?.relationships?.field_category?.data;
    if (catRel) {
        const items = Array.isArray(catRel) ? catRel : [catRel];
        categories = items
            .map((r: any) => includedIndex[`${r.type}:${r.id}`]?.attributes?.name)
            .filter((n: any) => typeof n === "string");
    }
    return { title: node.attributes.title, html, image, images, categories };
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
