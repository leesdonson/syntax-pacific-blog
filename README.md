# Syntax Pacific Devlog

The official blog website for Syntax Pacific Ltd — a place to share practical product and engineering insights, thoughtful ideas, performance techniques, software strategies, local technology news, and stories that help developers grow.

This project is built as a modern editorial platform for technical writing, with a clean reading experience, responsive layout, category browsing, search, and article discovery features.

## About the project

Syntax Pacific Devlog is designed to publish:

- software engineering tips and tricks
- product thinking and technical strategy
- frontend and backend performance ideas
- architecture and development workflow guidance
- local tech news and community updates
- thoughtful writing for fellow developers and curious readers

## Highlights

- Fast, modern Next.js blog experience
- Responsive layout for desktop and mobile readers
- Search and filtering by category and tags
- Featured article presentation and article feed
- Reading-focused design for long-form technical content
- Built for publishing developer-first content with code snippets and structured posts

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide icons and motion-based UI polish

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open http://localhost:3000 to view the site.

## Project structure

```text
src/
  app/                 # App router pages and layouts
  components/          # Reusable UI and blog components
  data/                # Blog post definitions and metadata
  hooks/               # Client-side interactions and search state
  layouts/             # Page layout composition
  pages/               # Page-level components
  types/               # Shared TypeScript types
  utils/               # Helpers for dates, slugs, markdown, and reading time
public/                # Static assets and icons
```

## Content model

Blog content is organized in the data layer, with posts defined in `src/data/posts.ts`. Each post includes metadata such as:

- title and slug
- excerpt
- publication date
- category
- tags
- author
- cover snippet
- article content

This makes it easy to add new writing and keep the front-end blog experience consistent.

## Development notes

For local development, start from the root of the project and edit the blog content and layouts in the `src` directory. The home feed, filters, and article pages are all built to support a lightweight editorial workflow without needing a heavy CMS.

## Why it exists

The site reflects a simple mission: to share practical knowledge, real-world engineering lessons, and thoughtful discussion around software creation and the wider local technology ecosystem. It is a platform for developers to learn, discover, and stay connected with the ideas shaping modern digital work.  

Learn more about our business at [Syntax Pacific](https://syntaxpacific.com.co) official website.
