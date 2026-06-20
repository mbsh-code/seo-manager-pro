import {
  addJsonLdSchema,
  addRawJsonLd,
  appendLink,
  clearManaged,
  isBrowser,
  SEO_MANAGED_ATTR,
  updateLink,
  updateMeta,
} from '../shared/dom';
import type { BreadcrumbItem, SeoConfig } from './types';

/**
 * Manages classic SEO: meta tags, Open Graph, Twitter Cards, canonical URLs, and Schema.org.
 */
export class SeoManager {
  static updateSeo(config: SeoConfig): void {
    if (!isBrowser()) return;

    this.clearManaged();

    if (config.title) {
      document.title = config.title;
    }

    if (config.description) {
      updateMeta('description', config.description, SEO_MANAGED_ATTR);
    }

    if (config.keywords) {
      const keywords = Array.isArray(config.keywords)
        ? config.keywords.join(', ')
        : config.keywords;
      updateMeta('keywords', keywords, SEO_MANAGED_ATTR);
    }

    if (config.author) {
      updateMeta('author', config.author, SEO_MANAGED_ATTR);
    }

    if (config.themeColor) {
      updateMeta('theme-color', config.themeColor, SEO_MANAGED_ATTR);
    }

    if (config.language) {
      document.documentElement.lang = config.language;
    }

    if (config.robots) {
      updateMeta('robots', config.robots, SEO_MANAGED_ATTR);
      updateMeta('googlebot', config.robots, SEO_MANAGED_ATTR);
    }

    this.applyOpenGraph(config);
    this.applyTwitter(config);
    this.applyCanonical(config.canonicalUrl);
    this.applyHreflang(config.hreflang);
    this.applyAlternateLinks(config.alternateLinks);
    this.applyIcons(config);

    if (config.breadcrumbs?.length) {
      addJsonLdSchema(
        'BreadcrumbList',
        this.buildBreadcrumbSchema(config.breadcrumbs),
        SEO_MANAGED_ATTR
      );
    }

    config.customMetaTags?.forEach(tag => {
      updateMeta(tag.name, tag.content, SEO_MANAGED_ATTR);
    });

    config.schema?.forEach(sch => {
      addJsonLdSchema(sch.type, sch.data, SEO_MANAGED_ATTR);
    });

    config.jsonLd?.forEach(data => {
      addRawJsonLd(data, SEO_MANAGED_ATTR);
    });
  }

  static resetSeo(): void {
    if (!isBrowser()) return;
    this.clearManaged();
    document.title = '';
    document.documentElement.removeAttribute('lang');
  }

  private static clearManaged(): void {
    clearManaged(SEO_MANAGED_ATTR);
  }

  private static applyOpenGraph(config: SeoConfig): void {
    const og = config.openGraph ?? {};
    const title = og.title ?? config.title;
    const description = config.description;
    const image = config.image;
    const url = og.url ?? config.canonicalUrl;

    if (title) updateMeta('og:title', title, SEO_MANAGED_ATTR, 'property');
    if (description) updateMeta('og:description', description, SEO_MANAGED_ATTR, 'property');
    if (image) {
      updateMeta('og:image', image, SEO_MANAGED_ATTR, 'property');
      if (og.imageAlt) updateMeta('og:image:alt', og.imageAlt, SEO_MANAGED_ATTR, 'property');
      if (og.imageWidth) {
        updateMeta('og:image:width', String(og.imageWidth), SEO_MANAGED_ATTR, 'property');
      }
      if (og.imageHeight) {
        updateMeta('og:image:height', String(og.imageHeight), SEO_MANAGED_ATTR, 'property');
      }
    }
    if (url) updateMeta('og:url', url, SEO_MANAGED_ATTR, 'property');
    updateMeta('og:type', og.type ?? 'website', SEO_MANAGED_ATTR, 'property');
    if (og.siteName) updateMeta('og:site_name', og.siteName, SEO_MANAGED_ATTR, 'property');
    if (og.locale) updateMeta('og:locale', og.locale, SEO_MANAGED_ATTR, 'property');
    if (og.publishedTime) {
      updateMeta('article:published_time', og.publishedTime, SEO_MANAGED_ATTR, 'property');
    }
    if (og.modifiedTime) {
      updateMeta('article:modified_time', og.modifiedTime, SEO_MANAGED_ATTR, 'property');
    }
    if (og.author) updateMeta('article:author', og.author, SEO_MANAGED_ATTR, 'property');
    if (og.section) updateMeta('article:section', og.section, SEO_MANAGED_ATTR, 'property');
    og.tags?.forEach(tag => {
      updateMeta('article:tag', tag, SEO_MANAGED_ATTR, 'property');
    });
  }

  private static applyTwitter(config: SeoConfig): void {
    const twitter = config.twitter ?? {};
    const card = twitter.card ?? (config.image ? 'summary_large_image' : 'summary');

    updateMeta('twitter:card', card, SEO_MANAGED_ATTR);
    if (twitter.site) updateMeta('twitter:site', twitter.site, SEO_MANAGED_ATTR);
    if (twitter.creator) updateMeta('twitter:creator', twitter.creator, SEO_MANAGED_ATTR);
    updateMeta('twitter:title', twitter.title ?? config.title, SEO_MANAGED_ATTR);
    updateMeta('twitter:description', twitter.description ?? config.description, SEO_MANAGED_ATTR);
    updateMeta('twitter:image', twitter.image ?? config.image ?? '', SEO_MANAGED_ATTR);
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
    link.setAttribute(SEO_MANAGED_ATTR, 'true');
  }

  private static applyHreflang(links?: SeoConfig['hreflang']): void {
    links?.forEach(({ lang, url }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = url;
      appendLink(link, SEO_MANAGED_ATTR);
    });
  }

  private static applyAlternateLinks(links?: SeoConfig['alternateLinks']): void {
    links?.forEach(({ rel, href, type, title, hreflang }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (type) link.type = type;
      if (title) link.title = title;
      if (hreflang) link.hreflang = hreflang;
      appendLink(link, SEO_MANAGED_ATTR);
    });
  }

  private static applyIcons(config: SeoConfig): void {
    if (config.favicon) {
      updateLink('icon', config.favicon, SEO_MANAGED_ATTR);
    }
    if (config.appleTouchIcon) {
      updateLink('apple-touch-icon', config.appleTouchIcon, SEO_MANAGED_ATTR);
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
}

/** @deprecated Use `SeoManager` instead. Kept for backward compatibility. */
export class SeoManagerPro extends SeoManager {}
