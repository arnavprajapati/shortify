'use client';

import React, { useState } from 'react';

export interface LinkItem {
  shortUrl: string;
  originalUrl: string;
}

interface LinksListProps {
  links: LinkItem[];
}

export default function LinksList({ links }: LinksListProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(text);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch {
      alert('Could not copy link');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
          My Links
        </h3>
        {links.length > 0 && (
          <span className="text-xs text-slate-400 font-medium">
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
        )}
      </div>

      {links.length === 0 ? (
        <div className="p-6 text-center bg-white border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
          No links yet
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm max-h-[290px] overflow-y-auto">
          <ul className="space-y-2">
            {links.map((item, index) => (
              <li
                key={index}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline block truncate"
                  >
                    {item.shortUrl}
                  </a>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {item.originalUrl}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(item.shortUrl)}
                  className="px-2.5 py-1 text-xs border border-slate-300 bg-white hover:bg-slate-100 rounded text-slate-700 shrink-0 transition"
                >
                  {copiedItem === item.shortUrl ? 'Copied!' : 'Copy'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
