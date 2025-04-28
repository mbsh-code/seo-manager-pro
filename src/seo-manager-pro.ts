export type SchemaType = 'Product' | 'FAQPage' | 'Article';

export interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  robots?: 'index,follow' | 'noindex,nofollow' | 'index,nofollow' | 'noindex,follow';
  schema?: {
    type: SchemaType;
    data: Record<string, any>;
  }[];
  customMetaTags?: { name: string; content: string }[];
}

export class SeoManagerPro {
  static updateSeo(config: SeoConfig): void {
    this.clearPrevious();
    if (config.title) document.title = config.title;
    if (config.description) {
      this.updateMeta('description', config.description);
      this.updateMeta('og:description', config.description);
    }
    if (config.image) {
      this.updateMeta('og:image', config.image);
    }
    if (config.canonicalUrl) {
      this.updateCanonical(config.canonicalUrl);
    }
    if (config.robots) {
      this.updateMeta('robots', config.robots);
    }
    if (config.customMetaTags?.length) {
      config.customMetaTags.forEach(tag => {
        this.updateMeta(tag.name, tag.content);
      });
    }
    if (config.schema?.length) {
      config.schema.forEach(sch => {
        this.addSchema(sch.type, sch.data);
      });
    }
  }

  private static updateMeta(name: string, content: string): void {
    let tag = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      if (name.startsWith('og:')) {
        tag.setAttribute('property', name);
      } else {
        tag.setAttribute('name', name);
      }
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  private static updateCanonical(url: string): void {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }

  private static addSchema(type: SchemaType, data: Record<string, any>): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    });
    script.className = 'dynamic-schema';
    document.head.appendChild(script);
  }

  private static clearPrevious(): void {
    const oldSchemas = document.querySelectorAll('script.dynamic-schema');
    oldSchemas.forEach(script => script.remove());

    const oldCanonical = document.querySelector('link[rel="canonical"]');
    if (oldCanonical) oldCanonical.remove();
  }
}