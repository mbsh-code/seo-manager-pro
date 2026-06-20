export type RobotsDirective =
  | 'index,follow'
  | 'noindex,nofollow'
  | 'index,nofollow'
  | 'noindex,follow';

export type SchemaType =
  | 'Product'
  | 'FAQPage'
  | 'Article'
  | 'BlogPosting'
  | 'Organization'
  | 'WebSite'
  | 'WebPage'
  | 'LocalBusiness'
  | 'Person'
  | 'BreadcrumbList'
  | 'Event'
  | 'VideoObject'
  | 'Recipe'
  | 'SoftwareApplication';

export type OpenGraphType =
  | 'website'
  | 'article'
  | 'product'
  | 'profile'
  | 'book'
  | 'video.other';

export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';

/** Search-engine optimization configuration for classic SEO (Google, Bing, etc.). */
export interface OpenGraphConfig {
  title?: string;
  type?: OpenGraphType;
  url?: string;
  siteName?: string;
  locale?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export interface TwitterConfig {
  card?: TwitterCardType;
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface HreflangLink {
  lang: string;
  url: string;
}

export interface AlternateLink {
  rel: 'prev' | 'next' | 'alternate' | 'canonical' | 'manifest' | 'sitemap';
  href: string;
  type?: string;
  title?: string;
  hreflang?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SchemaConfig {
  type: SchemaType;
  data: Record<string, unknown>;
}

/** Full SEO config for search engines and social previews. */
export interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  robots?: RobotsDirective;
  keywords?: string | string[];
  author?: string;
  themeColor?: string;
  language?: string;
  openGraph?: OpenGraphConfig;
  twitter?: TwitterConfig;
  hreflang?: HreflangLink[];
  alternateLinks?: AlternateLink[];
  breadcrumbs?: BreadcrumbItem[];
  schema?: SchemaConfig[];
  jsonLd?: Record<string, unknown>[];
  customMetaTags?: { name: string; content: string }[];
  favicon?: string;
  appleTouchIcon?: string;
}
