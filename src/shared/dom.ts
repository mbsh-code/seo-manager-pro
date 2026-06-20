export const SEO_MANAGED_ATTR = 'data-seo-manager-pro';
export const AEO_MANAGED_ATTR = 'data-aeo-manager-pro';

export function isBrowser(): boolean {
  return typeof document !== 'undefined';
}

export function markManaged(element: Element, managedAttr: string): void {
  element.setAttribute(managedAttr, 'true');
}

export function clearManaged(managedAttr: string): void {
  document.querySelectorAll(`[${managedAttr}]`).forEach(element => element.remove());
}

export function updateMeta(
  name: string,
  content: string,
  managedAttr: string,
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
  markManaged(tag, managedAttr);
}

export function updateLink(rel: string, href: string, managedAttr: string): void {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
  markManaged(link, managedAttr);
}

export function appendLink(
  link: HTMLLinkElement,
  managedAttr: string
): void {
  document.head.appendChild(link);
  markManaged(link, managedAttr);
}

export function addRawJsonLd(data: Record<string, unknown>, managedAttr: string): void {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
  markManaged(script, managedAttr);
}

export function addJsonLdSchema(
  type: string,
  data: Record<string, unknown>,
  managedAttr: string
): void {
  addRawJsonLd(
    {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    },
    managedAttr
  );
}

export function addPageSummaryJson(
  id: string,
  data: Record<string, unknown>,
  managedAttr: string
): void {
  const script = document.createElement('script');
  script.type = 'application/json';
  script.id = id;
  script.textContent = JSON.stringify(data, null, 2);
  document.head.appendChild(script);
  markManaged(script, managedAttr);
}
