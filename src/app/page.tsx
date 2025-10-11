"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SafeHTML from "@/app/_components/SafeHTML";

interface HomePage {
  title: string;
  html?: string;
  image?: { url: string; alt?: string };
}

export default function Home() {
  const [home, setHome] = useState<HomePage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomePage() {
      try {
        const response = await fetch('/api/pages/home');
        if (response.ok) {
          const data = await response.json();
          setHome(data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    loadHomePage();
  }, []);

  if (loading) {
    return (
      <section className="prose text-center">
        <div className="text-responsive">Loading...</div>
      </section>
    );
  }

  if (home) {
    return (
      <article className="split-layout">
        {/* Left side with profile image */}
        <div className="split-left flex justify-center items-center">
          {home.image?.url ? (
            <div className="w-40 h-40 rounded-full border-5 border-[var(--border)] p-[2px]">
              <Image
                src={home.image.url}
                alt={home.image.alt ?? home.title}
                width={160}
                height={160}
                className="w-full h-full rounded-full object-cover object-top"
              />
            </div>
          ) : null}
        </div>

        {/* Divider */}
        <div className="divider" aria-hidden="true"></div>

        {/* Right side with text */}
        <div className="split-right prose flex flex-col justify-center">
          <SafeHTML html={home.html ?? ""} />
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
