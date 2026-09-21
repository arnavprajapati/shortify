'use client';

import React, { useState } from 'react';

interface ShortenerFormProps {
  inputRef?: React.RefObject<HTMLInputElement>;
  onLinkCreated: (shortUrl: string, originalUrl: string) => void;
}

export default function ShortenerForm({ inputRef, onLinkCreated }: ShortenerFormProps) {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          customAlias: customAlias.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      const generated = data.shortUrl || `${window.location.origin}/${data.id}`;
      setShortUrl(generated);
      onLinkCreated(generated, url.trim());

      setUrl('');
      setCustomAlias('');
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          ref={inputRef}
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very-long-url"
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition"
        />

        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-slate-50 border border-slate-300 rounded-lg px-3 focus-within:bg-white focus-within:border-slate-900 transition">
            <span className="text-xs text-slate-400 select-none">/</span>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value.replace(/\s+/g, '-'))}
              placeholder="custom-name (optional)"
              className="w-full pl-1.5 py-2.5 bg-transparent text-sm text-slate-900 outline-none placeholder-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-sm font-medium rounded-lg transition disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-3 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
          {error}
        </p>
      )}

      {shortUrl && (
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-600 hover:underline truncate"
          >
            {shortUrl}
          </a>
          <button
            type="button"
            onClick={() => handleCopy(shortUrl)}
            className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-xs font-medium text-slate-700 rounded transition shrink-0"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
