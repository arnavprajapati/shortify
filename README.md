# Shortify

A simple URL shortener built with Next.js, TypeScript, and MongoDB. Paste a long URL and get a short, shareable link in seconds. Supports custom aliases and stores your links locally in the browser.

## Features

- Shorten any long URL to a compact link.
- Optional custom alias for personalized short URLs.
- Redirect to original URL with click tracking.
- Links saved locally in browser storage.
- Clean light-mode UI built with Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB via Mongoose
- **Styling**: Tailwind CSS
- **Font**: Inter (Google Fonts)
- **ID Generation**: nanoid

## Getting Started

Install dependencies:

```bash
npm install
```

Add a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3009](http://localhost:3009) in your browser.