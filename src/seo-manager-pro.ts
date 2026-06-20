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

const MANAGED_ATTR = 'data-seo-manager-pro';

export class SeoManagerPro {
  static updateSeo(config: SeoConfig): void {
    if (!this.isBrowser()) return;

    this.clearManaged();

    if (config.title) {
      document.title = config.title;
    }

    if (config.description) {
      this.updateMeta('description', config.description);
    }

    if (config.keywords) {
      const keywords = Array.isArray(config.keywords)
        ? config.keywords.join(', ')
        : config.keywords;
      this.updateMeta('keywords', keywords);
    }

    if (config.author) {
      this.updateMeta('author', config.author);
    }

    if (config.themeColor) {
      this.updateMeta('theme-color', config.themeColor);
    }

    if (config.language) {
      document.documentElement.lang = config.language;
    }

    if (config.robots) {
      this.updateMeta('robots', config.robots);
      this.updateMeta('googlebot', config.robots);
    }

    this.applyOpenGraph(config);
    this.applyTwitter(config);
    this.applyCanonical(config.canonicalUrl);
    this.applyHreflang(config.hreflang);
    this.applyAlternateLinks(config.alternateLinks);
    this.applyIcons(config);

    if (config.breadcrumbs?.length) {
      this.addSchema('BreadcrumbList', this.buildBreadcrumbSchema(config.breadcrumbs));
    }

    config.customMetaTags?.forEach(tag => {
      this.updateMeta(tag.name, tag.content);
    });

    config.schema?.forEach(sch => {
      this.addSchema(sch.type, sch.data);
    });

    config.jsonLd?.forEach(data => {
      this.addRawJsonLd(data);
    });
  }

  static resetSeo(): void {
    if (!this.isBrowser()) return;
    this.clearManaged();
    document.title = '';
    document.documentElement.removeAttribute('lang');
  }

  private static isBrowser(): boolean {
    return typeof document !== 'undefined';
  }

  private static applyOpenGraph(config: SeoConfig): void {
    const og = config.openGraph ?? {};
    const title = og.title ?? config.title;
    const description = config.description;
    const image = config.image;
    const url = og.url ?? config.canonicalUrl;

    if (title) this.updateMeta('og:title', title, 'property');
    if (description) this.updateMeta('og:description', description, 'property');
    if (image) {
      this.updateMeta('og:image', image, 'property');
      if (og.imageAlt) this.updateMeta('og:image:alt', og.imageAlt, 'property');
      if (og.imageWidth) this.updateMeta('og:image:width', String(og.imageWidth), 'property');
      if (og.imageHeight) this.updateMeta('og:image:height', String(og.imageHeight), 'property');
    }
    if (url) this.updateMeta('og:url', url, 'property');
    this.updateMeta('og:type', og.type ?? 'website', 'property');
    if (og.siteName) this.updateMeta('og:site_name', og.siteName, 'property');
    if (og.locale) this.updateMeta('og:locale', og.locale, 'property');
    if (og.publishedTime) this.updateMeta('article:published_time', og.publishedTime, 'property');
    if (og.modifiedTime) this.updateMeta('article:modified_time', og.modifiedTime, 'property');
    if (og.author) this.updateMeta('article:author', og.author, 'property');
    if (og.section) this.updateMeta('article:section', og.section, 'property');
    og.tags?.forEach(tag => {
      this.updateMeta('article:tag', tag, 'property');
    });
  }

  private static applyTwitter(config: SeoConfig): void {
    const twitter = config.twitter ?? {};
    const card = twitter.card ?? (config.image ? 'summary_large_image' : 'summary');

    this.updateMeta('twitter:card', card, 'name');
    if (twitter.site) this.updateMeta('twitter:site', twitter.site, 'name');
    if (twitter.creator) this.updateMeta('twitter:creator', twitter.creator, 'name');
    this.updateMeta('twitter:title', twitter.title ?? config.title, 'name');
    this.updateMeta('twitter:description', twitter.description ?? config.description, 'name');
    this.updateMeta('twitter:image', twitter.image ?? config.image ?? '', 'name');
  }

  private static applyCanonical(url?: string): void {
    if (!url) return;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
    this.markManaged(link);
  }

  private static applyHreflang(links?: HreflangLink[]): void {
    links?.forEach(({ lang, url }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = url;
      document.head.appendChild(link);
      this.markManaged(link);
    });
  }

  private static applyAlternateLinks(links?: AlternateLink[]): void {
    links?.forEach(({ rel, href, type, title, hreflang }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (type) link.type = type;
      if (title) link.title = title;
      if (hreflang) link.hreflang = hreflang;
      document.head.appendChild(link);
      this.markManaged(link);
    });
  }

  private static applyIcons(config: SeoConfig): void {
    if (config.favicon) {
      this.updateLink('icon', config.favicon);
    }
    if (config.appleTouchIcon) {
      this.updateLink('apple-touch-icon', config.appleTouchIcon);
    }
  }

  private static buildBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
    return {
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  private static updateMeta(
    name: string,
    content: string,
    attr: 'name' | 'property' = 'name'
  ): void {
    if (!content) return;

    let tag =
      document.querySelector(`meta[${attr}="${name}"]`) ??
      document.querySelector(`meta[name="${name}"]`) ??
      document.querySelector(`meta[property="${name}"]`);

    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    } else {
      tag.setAttribute(attr, name);
    }

    tag.setAttribute('content', content);
    this.markManaged(tag);
  }

  private static updateLink(rel: string, href: string): void {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
    this.markManaged(link);
  }

  private static addSchema(type: SchemaType, data: Record<string, unknown>): void {
    this.addRawJsonLd({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    });
  }

  private static addRawJsonLd(data: Record<string, unknown>): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    this.markManaged(script);
  }

  private static markManaged(element: Element): void {
    element.setAttribute(MANAGED_ATTR, 'true');
  }

  private static clearManaged(): void {
    document.querySelectorAll(`[${MANAGED_ATTR}]`).forEach(element => element.remove());
  }
}
