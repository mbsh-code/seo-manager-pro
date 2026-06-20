export type AiCrawlerBot =
  | 'GPTBot'
  | 'ChatGPT-User'
  | 'ClaudeBot'
  | 'anthropic-ai'
  | 'Google-Extended'
  | 'PerplexityBot'
  | 'Bytespider'
  | 'Applebot-Extended'
  | 'cohere-ai'
  | 'CCBot';

export type AiCrawlerPolicy = 'allow' | 'disallow';

export type AeoSchemaType =
  | 'HowTo'
  | 'QAPage'
  | 'FAQPage'
  | 'SpeakableSpecification'
  | 'WebSite'
  | 'WebPage'
  | 'Article'
  | 'BlogPosting'
  | 'Product'
  | 'Organization'
  | 'Person';

export interface EntityReference {
  name: string;
  type?: string;
  url?: string;
  sameAs?: string[];
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

export interface HowToConfig {
  name: string;
  description?: string;
  totalTime?: string;
  steps: HowToStep[];
}

export interface SpeakableConfig {
  cssSelector?: string[];
  xpath?: string[];
}

export interface CitationConfig {
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
  license?: string;
  isBasedOn?: string;
  publisher?: string;
}

export interface PageSummary {
  title: string;
  description: string;
  url?: string;
  language?: string;
  keyPoints?: string[];
  topics?: string[];
  entities?: EntityReference[];
}

export interface LlmsTxtPage {
  title: string;
  url: string;
  summary?: string;
}

export interface LlmsTxtConfig {
  siteName: string;
  description: string;
  details?: string;
  pages: LlmsTxtPage[];
  optionalPages?: LlmsTxtPage[];
}

export interface AeoSchemaConfig {
  type: AeoSchemaType;
  data: Record<string, unknown>;
}

/**
 * Answer Engine Optimization (AEO) config for AI crawlers, agents, and LLM discovery.
 * Optimizes pages for ChatGPT, Claude, Perplexity, and similar answer engines.
 */
export interface AeoConfig {
  /** Human-readable page summary injected as machine-readable JSON. */
  pageSummary?: PageSummary;
  /** Per-bot crawl/index policy hints via meta tags. */
  aiRobots?: Partial<Record<AiCrawlerBot | string, AiCrawlerPolicy>>;
  /** URL to your site's /llms.txt file (injects a discoverable link tag). */
  llmsTxtUrl?: string;
  /** URL to a Markdown version of this page for AI parsers. */
  markdownUrl?: string;
  /** Structured FAQ — auto-builds FAQPage JSON-LD. */
  faq?: FaqItem[];
  /** HowTo guide — auto-builds HowTo JSON-LD. */
  howTo?: HowToConfig;
  /** Voice/assistant speakable selectors. */
  speakable?: SpeakableConfig;
  /** Citation metadata for AI attribution. */
  citation?: CitationConfig;
  /** Named entities mentioned on the page. */
  entities?: EntityReference[];
  /** Typed Schema.org blocks optimized for AI parsing. */
  schema?: AeoSchemaConfig[];
  /** Raw JSON-LD objects. */
  jsonLd?: Record<string, unknown>[];
  /** Multiple schemas wrapped in a single @graph node. */
  jsonLdGraph?: Record<string, unknown>[];
  /** Extra AI-oriented meta tags (abstract, summary, etc.). */
  customAiMetaTags?: { name: string; content: string }[];
}

export interface AeoArticlePresetInput {
  title: string;
  description: string;
  url: string;
  author: string;
  publishedAt: string;
  modifiedAt?: string;
  keyPoints?: string[];
  topics?: string[];
  faq?: FaqItem[];
}

export interface AeoProductPresetInput {
  name: string;
  description: string;
  url: string;
  price: number;
  currency: string;
  brand?: string;
  faq?: FaqItem[];
}

export interface AeoFaqPresetInput {
  title: string;
  description: string;
  url: string;
  items: FaqItem[];
}

export interface AeoHowToPresetInput {
  title: string;
  description: string;
  url: string;
  totalTime?: string;
  steps: HowToStep[];
}
