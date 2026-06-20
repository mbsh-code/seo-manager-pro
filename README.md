# SEO Manager Pro

[![NPM Version](https://img.shields.io/npm/v/seo-manager-pro.svg)](https://www.npmjs.com/package/seo-manager-pro)

A lightweight, framework-agnostic **SEO + AEO** manager for **Angular**, **React**, **Vue**, and **Vanilla JS** SPAs.

The package is split into two independent modules:

| Module | Class | Purpose |
|--------|-------|---------|
| **SEO** | `SeoManager` | Google, Bing, social previews (Open Graph, Twitter, canonical, robots) |
| **AEO** | `AeoManager` | AI answer engines (ChatGPT, Claude, Perplexity) — llms.txt, page summaries, AI robots, FAQ/HowTo schema |

Use them together or separately. Each has its own `reset()` method and does not interfere with the other.

---

## Features

| Category | What you get |
|----------|--------------|
| **Basic Meta** | `title`, `description`, `keywords`, `author`, `theme-color`, `language` (`<html lang>`) |
| **Open Graph** | `og:title`, `og:description`, `og:image`, image alt/size, `og:url`, `og:type`, `og:site_name`, `og:locale` |
| **Article OG** | `article:published_time`, `article:modified_time`, `article:author`, `article:section`, `article:tag` |
| **Twitter Cards** | `twitter:card`, `twitter:site`, `twitter:creator`, title, description, image |
| **Indexing** | `robots` + `googlebot`, canonical URL |
| **International** | `hreflang` alternate links |
| **Pagination / Feeds** | `prev`, `next`, `alternate`, `manifest`, `sitemap` link tags |
| **Structured Data** | Built-in Schema.org types + raw `jsonLd` for anything else |
| **Breadcrumbs** | Auto-generates `BreadcrumbList` JSON-LD from a simple array |
| **Icons** | Dynamic `favicon` and `apple-touch-icon` |
| **Cleanup** | `resetSeo()` removes everything the library injected |
| **SSR-safe** | No-op when `document` is unavailable (Node / SSR) |

### AEO (Answer Engine Optimization)

| Category | What you get |
|----------|--------------|
| **Page Summary** | Machine-readable JSON + `abstract` / `summary` meta for AI parsers |
| **AI Crawlers** | Per-bot meta hints (`GPTBot`, `ClaudeBot`, `PerplexityBot`, …) |
| **llms.txt** | `generateLlmsTxt()` + discoverable link tag |
| **Markdown alt** | Link to Markdown version of the page |
| **FAQ / HowTo** | Auto `FAQPage` and `HowTo` JSON-LD |
| **Entities** | `@graph` entity markup with `sameAs` for AI citation |
| **Citation** | Author, dates, license, publisher for AI attribution |
| **Speakable** | `SpeakableSpecification` for voice assistants |
| **Presets** | `AeoPresets.article()`, `.product()`, `.faq()`, `.howTo()` |
| **Cleanup** | `resetAeo()` removes all AEO-injected tags |

---

## Installation

```bash
npm install seo-manager-pro
```

```bash
yarn add seo-manager-pro
```

---

## Quick Start

```typescript
import { SeoManager, AeoManager, AeoPresets } from 'seo-manager-pro';

// Classic SEO (search engines + social)
SeoManager.updateSeo({
  title: 'Home Page | My Shop',
  description: 'Welcome to the best online store.',
  image: 'https://example.com/og-image.jpg',
  canonicalUrl: 'https://example.com/',
  robots: 'index,follow',
  openGraph: { siteName: 'My Shop', locale: 'en_US' },
  twitter: { card: 'summary_large_image', site: '@myshop' },
});

// AEO (AI answer engines)
AeoManager.updateAeo({
  llmsTxtUrl: 'https://example.com/llms.txt',
  pageSummary: {
    title: 'My Shop',
    description: 'Online store for electronics and accessories.',
    url: 'https://example.com/',
    keyPoints: ['Free shipping', '24/7 support', 'Secure checkout'],
    topics: ['ecommerce', 'electronics'],
  },
  aiRobots: {
    GPTBot: 'allow',
    ClaudeBot: 'allow',
    PerplexityBot: 'allow',
  },
});

// Or use an AEO preset (ideal for AI coding tools)
AeoManager.updateAeo(
  AeoPresets.article({
    title: '10 SEO Tips',
    description: 'Practical tips for SPA SEO.',
    url: 'https://example.com/blog/seo-tips',
    author: 'Jane Doe',
    publishedAt: '2025-06-01T10:00:00Z',
    keyPoints: ['Use canonical URLs', 'Add structured data'],
  })
);
```

> `SeoManagerPro` is still exported as an alias for `SeoManager` (backward compatible).

---

## API Reference

### SEO — `SeoManager.updateSeo(config: SeoConfig)`

Updates all SEO tags for the current page. Previous SEO tags injected by this library are removed first.

### SEO — `SeoManager.resetSeo()`

Removes every SEO tag/link/script the library added and clears `document.title` and `<html lang>`.

### AEO — `AeoManager.updateAeo(config: AeoConfig)`

Injects AI-friendly metadata: page summary JSON, FAQ/HowTo schema, entity graphs, llms.txt link, and AI crawler hints.

### AEO — `AeoManager.resetAeo()`

Removes all AEO-injected tags without touching SEO tags.

### AEO — `AeoManager.generateLlmsTxt(config: LlmsTxtConfig): string`

Generates `llms.txt` markdown content. Host it at `https://yoursite.com/llms.txt`:

```typescript
const content = AeoManager.generateLlmsTxt({
  siteName: 'My Shop',
  description: 'Online electronics store.',
  pages: [
    { title: 'Products', url: 'https://example.com/products', summary: 'All products' },
    { title: 'FAQ', url: 'https://example.com/faq', summary: 'Common questions' },
  ],
});
// Serve `content` as a static file at /llms.txt
```

### AEO — `AeoPresets`

| Method | Use case |
|--------|----------|
| `AeoPresets.article({...})` | Blog posts and articles |
| `AeoPresets.product({...})` | Product pages |
| `AeoPresets.faq({...})` | FAQ pages |
| `AeoPresets.howTo({...})` | Tutorials and guides |

### Subpath imports

```typescript
import { SeoManager } from 'seo-manager-pro/seo';
import { AeoManager, AeoPresets } from 'seo-manager-pro/aeo';
```

---

## `SeoConfig` Options

### Core fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | ✅ | Page title (`<title>`) |
| `description` | `string` | ✅ | Meta description |
| `image` | `string` | | Default image for Open Graph and Twitter |
| `canonicalUrl` | `string` | | Canonical URL (`<link rel="canonical">`) |
| `robots` | `RobotsDirective` | | Crawler directive — also sets `googlebot` |
| `keywords` | `string \| string[]` | | Meta keywords (comma-separated if array) |
| `author` | `string` | | Content author |
| `themeColor` | `string` | | Browser UI color (`theme-color`) |
| `language` | `string` | | Sets `<html lang="...">` (e.g. `en`, `fa`, `de`) |
| `favicon` | `string` | | Favicon URL |
| `appleTouchIcon` | `string` | | Apple touch icon URL |

### `robots` values

```typescript
'index,follow'    // default — allow indexing and following links
'noindex,nofollow' // hide page and don't follow links
'index,nofollow'   // index page but don't follow links
'noindex,follow'   // don't index but follow links
```

### `openGraph`

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Overrides `og:title` (defaults to `title`) |
| `type` | `OpenGraphType` | `website`, `article`, `product`, `profile`, `book`, `video.other` |
| `url` | `string` | Overrides `og:url` (defaults to `canonicalUrl`) |
| `siteName` | `string` | `og:site_name` |
| `locale` | `string` | e.g. `en_US`, `fa_IR` |
| `imageAlt` | `string` | `og:image:alt` |
| `imageWidth` | `number` | `og:image:width` |
| `imageHeight` | `number` | `og:image:height` |
| `publishedTime` | `string` | ISO 8601 — `article:published_time` |
| `modifiedTime` | `string` | ISO 8601 — `article:modified_time` |
| `author` | `string` | `article:author` |
| `section` | `string` | `article:section` |
| `tags` | `string[]` | Multiple `article:tag` meta tags |

### `twitter`

| Field | Type | Description |
|-------|------|-------------|
| `card` | `TwitterCardType` | `summary`, `summary_large_image`, `app`, `player` |
| `site` | `string` | `@username` of the site |
| `creator` | `string` | `@username` of the content creator |
| `title` | `string` | Overrides page title for Twitter |
| `description` | `string` | Overrides description for Twitter |
| `image` | `string` | Overrides image for Twitter |

> If `twitter.card` is omitted, `summary_large_image` is used when `image` is set; otherwise `summary`.

### `hreflang`

For multilingual / regional SEO:

```typescript
hreflang: [
  { lang: 'en', url: 'https://example.com/en/page' },
  { lang: 'fa', url: 'https://example.com/fa/page' },
  { lang: 'x-default', url: 'https://example.com/page' },
]
```

### `alternateLinks`

Pagination, feeds, manifest, and other `<link rel="...">` tags:

```typescript
alternateLinks: [
  { rel: 'prev', href: 'https://example.com/blog?page=1' },
  { rel: 'next', href: 'https://example.com/blog?page=3' },
  { rel: 'sitemap', href: 'https://example.com/sitemap.xml', type: 'application/xml' },
]
```

### `breadcrumbs`

Automatically builds a `BreadcrumbList` Schema.org script:

```typescript
breadcrumbs: [
  { name: 'Home', url: 'https://example.com/' },
  { name: 'Blog', url: 'https://example.com/blog' },
  { name: 'Post Title', url: 'https://example.com/blog/post' },
]
```

### `schema`

Inject typed Schema.org JSON-LD:

```typescript
schema: [
  {
    type: 'Product',
    data: {
      name: 'iPhone 15',
      description: 'The best smartphone ever.',
      image: 'https://example.com/iphone.jpg',
      offers: {
        '@type': 'Offer',
        price: 999,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
  },
  {
    type: 'FAQPage',
    data: {
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is it waterproof?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, it has IP68 rating.',
          },
        },
      ],
    },
  },
]
```

### `jsonLd`

For schemas not covered by built-in types, pass raw JSON-LD objects:

```typescript
jsonLd: [
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to install SEO Manager Pro',
    step: [
      { '@type': 'HowToStep', text: 'Run npm install seo-manager-pro' },
      { '@type': 'HowToStep', text: 'Call SeoManagerPro.updateSeo(...)' },
    ],
  },
]
```

### `customMetaTags`

Any extra `<meta name="..." content="...">` tags:

```typescript
customMetaTags: [
  { name: 'referrer', content: 'strict-origin-when-cross-origin' },
  { name: 'format-detection', content: 'telephone=no' },
]
```

---

## `AeoConfig` Options

| Field | Type | Description |
|-------|------|-------------|
| `pageSummary` | `PageSummary` | Title, description, key points, topics, entities — injected as JSON |
| `aiRobots` | `Partial<Record<AiCrawlerBot, AiCrawlerPolicy>>` | Per-bot policy: `GPTBot`, `ClaudeBot`, `PerplexityBot`, … |
| `llmsTxtUrl` | `string` | URL to `/llms.txt` (adds discoverable link tag) |
| `markdownUrl` | `string` | Alternate Markdown version of the page |
| `faq` | `FaqItem[]` | Auto-builds `FAQPage` JSON-LD |
| `howTo` | `HowToConfig` | Auto-builds `HowTo` JSON-LD |
| `speakable` | `SpeakableConfig` | CSS/XPath selectors for voice assistants |
| `citation` | `CitationConfig` | Author, dates, license for AI attribution |
| `entities` | `EntityReference[]` | Named entities with optional `sameAs` URLs |
| `schema` | `AeoSchemaConfig[]` | Typed AI-oriented Schema.org blocks |
| `jsonLd` | `Record<string, unknown>[]` | Raw JSON-LD |
| `jsonLdGraph` | `Record<string, unknown>[]` | Multiple nodes in one `@graph` |
| `customAiMetaTags` | `{ name, content }[]` | Extra AI-oriented meta tags |

### Supported AI crawlers (`aiRobots`)

`GPTBot`, `ChatGPT-User`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `PerplexityBot`, `Bytespider`, `Applebot-Extended`, `cohere-ai`, `CCBot`

### Full AEO example

```typescript
AeoManager.updateAeo({
  llmsTxtUrl: 'https://example.com/llms.txt',
  markdownUrl: 'https://example.com/blog/seo-tips.md',
  pageSummary: {
    title: '10 SEO Tips for SPAs',
    description: 'A practical guide to SPA SEO and AEO.',
    url: 'https://example.com/blog/seo-tips',
    language: 'en',
    keyPoints: [
      'Set canonical URLs on every route',
      'Add FAQ schema for AI snippets',
      'Publish llms.txt for agent discovery',
    ],
    topics: ['seo', 'spa', 'aeo'],
    entities: [
      { name: 'Google', type: 'Organization', sameAs: ['https://www.google.com'] },
    ],
  },
  aiRobots: {
    GPTBot: 'allow',
    ClaudeBot: 'allow',
    'Google-Extended': 'disallow',
  },
  citation: {
    author: 'Jane Doe',
    publishedAt: '2025-06-01T10:00:00Z',
    license: 'https://creativecommons.org/licenses/by/4.0/',
  },
  faq: [
    { question: 'What is AEO?', answer: 'Answer Engine Optimization for AI systems.' },
  ],
  jsonLdGraph: [
    { '@type': 'WebSite', name: 'My Blog', url: 'https://example.com' },
    { '@type': 'WebPage', name: '10 SEO Tips', url: 'https://example.com/blog/seo-tips' },
  ],
});
```

---

## Supported Schema Types

| Type | Best for |
|------|----------|
| `Product` | E-commerce product pages |
| `FAQPage` | FAQ sections |
| `Article` | Generic articles |
| `BlogPosting` | Blog posts |
| `Organization` | Company / brand pages |
| `WebSite` | Site-wide search box, publisher info |
| `WebPage` | Generic landing pages |
| `LocalBusiness` | Local SEO (address, hours, geo) |
| `Person` | Author / profile pages |
| `BreadcrumbList` | Manual breadcrumb schema (or use `breadcrumbs` helper) |
| `Event` | Events, webinars, concerts |
| `VideoObject` | Video pages |
| `Recipe` | Recipe pages |
| `SoftwareApplication` | Apps, SaaS products |

---

## Framework Examples

### React (with `useEffect`)

```tsx
import { useEffect } from 'react';
import { SeoManagerPro } from 'seo-manager-pro';

function ProductPage({ product }) {
  useEffect(() => {
    SeoManagerPro.updateSeo({
      title: `${product.name} | My Shop`,
      description: product.summary,
      image: product.image,
      canonicalUrl: `https://example.com/products/${product.slug}`,
      robots: 'index,follow',
      openGraph: { type: 'product' },
      schema: [
        {
          type: 'Product',
          data: {
            name: product.name,
            image: product.image,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'USD',
            },
          },
        },
      ],
    });

    return () => SeoManagerPro.resetSeo();
  }, [product]);

  return <div>{product.name}</div>;
}
```

### Vue 3 (`onMounted` / `watch`)

```typescript
import { watch, onUnmounted } from 'vue';
import { SeoManagerPro } from 'seo-manager-pro';

watch(
  () => route.fullPath,
  () => {
    SeoManagerPro.updateSeo({
      title: 'My Vue App',
      description: 'Built with Vue 3',
      canonicalUrl: `https://example.com${route.fullPath}`,
    });
  },
  { immediate: true }
);

onUnmounted(() => SeoManagerPro.resetSeo());
```

### Angular (service or resolver)

```typescript
import { Injectable } from '@angular/core';
import { SeoManagerPro, SeoConfig } from 'seo-manager-pro';

@Injectable({ providedIn: 'root' })
export class SeoService {
  update(config: SeoConfig): void {
    SeoManagerPro.updateSeo(config);
  }

  reset(): void {
    SeoManagerPro.resetSeo();
  }
}
```

Use in a route resolver or `ngOnInit` / `ngOnDestroy` of your page component.

### Vanilla JS

```html
<script type="module">
  import { SeoManagerPro } from 'seo-manager-pro';

  SeoManagerPro.updateSeo({
    title: 'Contact Us',
    description: 'Get in touch with our team.',
    canonicalUrl: 'https://example.com/contact',
  });
</script>
```

---

## Blog Post Example (full SEO)

```typescript
SeoManagerPro.updateSeo({
  title: '10 SEO Tips for SPAs | My Blog',
  description: 'Learn how to optimize single-page apps for search engines.',
  image: 'https://example.com/blog/seo-tips/cover.jpg',
  canonicalUrl: 'https://example.com/blog/seo-tips',
  robots: 'index,follow',
  author: 'Jane Doe',
  language: 'en',
  openGraph: {
    type: 'article',
    siteName: 'My Blog',
    locale: 'en_US',
    publishedTime: '2025-06-01T10:00:00Z',
    modifiedTime: '2025-06-15T14:30:00Z',
    author: 'Jane Doe',
    section: 'SEO',
    tags: ['seo', 'spa', 'javascript'],
    imageAlt: 'SEO tips cover image',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@myblog',
    creator: '@janedoe',
  },
  breadcrumbs: [
    { name: 'Home', url: 'https://example.com/' },
    { name: 'Blog', url: 'https://example.com/blog' },
    { name: '10 SEO Tips for SPAs', url: 'https://example.com/blog/seo-tips' },
  ],
  schema: [
    {
      type: 'BlogPosting',
      data: {
        headline: '10 SEO Tips for SPAs',
        author: { '@type': 'Person', name: 'Jane Doe' },
        datePublished: '2025-06-01T10:00:00Z',
        dateModified: '2025-06-15T14:30:00Z',
        image: 'https://example.com/blog/seo-tips/cover.jpg',
      },
    },
  ],
});
```

---

## Local Business Example

```typescript
SeoManagerPro.updateSeo({
  title: 'Coffee House Tehran | Best Coffee',
  description: 'Specialty coffee in downtown Tehran. Open daily 8 AM – 10 PM.',
  canonicalUrl: 'https://example.com/tehran-coffee',
  robots: 'index,follow',
  language: 'fa',
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'Coffee House',
  },
  schema: [
    {
      type: 'LocalBusiness',
      data: {
        name: 'Coffee House Tehran',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Valiasr St',
          addressLocality: 'Tehran',
          addressCountry: 'IR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 35.6892,
          longitude: 51.3890,
        },
        openingHours: 'Mo-Su 08:00-22:00',
        telephone: '+98-21-12345678',
      },
    },
  ],
});
```

---

## SSR Notes

The library checks for `document` before touching the DOM. During server-side rendering, `updateSeo()` and `resetSeo()` are safe no-ops.

For best SEO in SSR frameworks (**Next.js**, **Nuxt**, **Angular SSR**), prefer setting meta tags in server-rendered HTML or framework-specific head APIs. Use **SEO Manager Pro** on the client for SPA route transitions and dynamic pages.

---

## Best Practices

1. **Call on every route change** — SPAs don't reload the page; update SEO when navigation happens.
2. **Use `resetSeo()` on unmount** — Avoid stale tags when leaving a page.
3. **Always set `canonicalUrl`** — Prevents duplicate-content issues with query strings or trailing slashes.
4. **Use absolute URLs** — For `image`, `canonicalUrl`, and schema URLs.
5. **Match OG and Twitter** — The library auto-fills Twitter from title/description/image; override only when needed.
6. **Add `hreflang` for multilingual sites** — Include `x-default` for the fallback locale.
7. **Prefer JSON-LD** — Google recommends JSON-LD for structured data; this library injects it automatically.
8. **Validate structured data** — Test with [Google Rich Results Test](https://search.google.com/test/rich-results).

---

## TypeScript

All types are exported from the package:

```typescript
import {
  SeoManager,
  SeoManagerPro,
  AeoManager,
  AeoPresets,
  SeoConfig,
  AeoConfig,
  SchemaType,
  OpenGraphConfig,
  TwitterConfig,
  PageSummary,
  LlmsTxtConfig,
} from 'seo-manager-pro';
```


Includes:
- ✅ Angular Demo
- ✅ React Demo
- ✅ Vanilla JavaScript Demo

---

## License

MIT © [MohammadBagher Sharifi](https://github.com/mbsh-code)
