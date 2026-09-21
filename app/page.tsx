'use client';

import React, { useState, useEffect, useRef } from 'react';
import Hero from '@/components/Hero';
import ShortenerForm from '@/components/ShortenerForm';
import LinksList, { LinkItem } from '@/components/LinksList';

export default function Home() {
  const [links, setLinks] = useState<LinkItem[]>([]);

  const shortenerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('my_links');
      if (saved) {
        setLinks(JSON.parse(saved));
      }
    } catch {
    }
  }, []);

  const handleGetStarted = () => {
    shortenerRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 450);
  };

  const handleLinkCreated = (shortUrl: string, originalUrl: string) => {
    const updated = [{ shortUrl, originalUrl }, ...links];
    setLinks(updated);
    localStorage.setItem('my_links', JSON.stringify(updated));
  };

  return (
    <div className="w-full">
      <Hero onGetStarted={handleGetStarted} />

      <section
        ref={shortenerRef}
        id="shortener"
        className="min-h-screen flex flex-col items-center justify-start px-4 py-20"
      >
        <div className="w-full max-w-lg">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
            URL Shortener
          </h2>
          <p className="text-center text-sm text-slate-500 mb-8">
            Enter a long URL to make it short and easy to share
          </p>

          <ShortenerForm
            inputRef={inputRef}
            onLinkCreated={handleLinkCreated}
          />

          <LinksList links={links} />
        </div>
      </section>
    </div>
  );
}
