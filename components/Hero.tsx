import React from 'react';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
          Shorten your links, share anywhere.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-md mx-auto">
          Transform messy, long URLs into clean, compact links in seconds. Free and saved to your device.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-3.5 bg-slate-900 hover:bg-black text-white font-medium text-base rounded-xl transition shadow-md hover:shadow-lg"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
