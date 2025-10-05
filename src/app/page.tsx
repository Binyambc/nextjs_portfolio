import { fetchPageBySlug } from "@/lib/drupal";

export default async function Home() {
  const home = await fetchPageBySlug("home").catch(() => null);

  if (home) {
    return (
      <article className="split-layout">
  {/* Left side with profile image */}
  <div className="split-left flex justify-center items-center">
    {home.image?.url ? (
      <div className="w-40 h-40 rounded-full border-5 border-[var(--border)] p-[2px]">
        <img
          src={home.image.url}
          alt={home.image.alt ?? home.title}
          className="w-full h-full rounded-full object-cover object-top"
        />
      </div>
    ) : null}
  </div>

  {/* Divider */}
  <div className="divider" aria-hidden="true"></div>

  {/* Right side with text */}
  <div className="split-right prose flex flex-col justify-center">
    <div dangerouslySetInnerHTML={{ __html: home.html ?? "" }} />
  </div>
</article>

    );
  }

  return (
    <section className="prose text-center">
      <h1>Welcome</h1>
      <p>Publish a Drupal page with slug &quot;home&quot; to populate this screen.</p>
    </section>
  );
}
