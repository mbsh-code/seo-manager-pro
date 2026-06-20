import {
  addJsonLdSchema,
  addPageSummaryJson,
  addRawJsonLd,
  AEO_MANAGED_ATTR,
  appendLink,
  clearManaged,
  isBrowser,
  updateMeta,
} from '../shared/dom';
import { generateLlmsTxt } from './llms-txt';
import type {
  AeoConfig,
  AiCrawlerPolicy,
  FaqItem,
  LlmsTxtConfig,
  PageSummary,
} from './types';

/**
 * Manages Answer Engine Optimization (AEO) for AI crawlers and LLM agents.
 * Separate from classic SEO — use alongside `SeoManager`.
 */
export class AeoManager {
  static updateAeo(config: AeoConfig): void {
    if (!isBrowser()) return;

    this.clearManaged();

    if (config.pageSummary) {
      this.applyPageSummary(config.pageSummary);
    }

    if (config.aiRobots) {
      this.applyAiRobots(config.aiRobots);
    }

    if (config.llmsTxtUrl) {
      this.applyLlmsTxtLink(config.llmsTxtUrl);
    }

    if (config.markdownUrl) {
      this.applyMarkdownLink(config.markdownUrl);
    }

    if (config.citation) {
      this.applyCitationMeta(config.citation);
    }

    if (config.speakable) {
      addJsonLdSchema(
        'WebPage',
        {
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: config.speakable.cssSelector,
            xpath: config.speakable.xpath,
          },
        },
        AEO_MANAGED_ATTR
      );
    }

    if (config.faq?.length) {
      addJsonLdSchema('FAQPage', this.buildFaqSchema(config.faq), AEO_MANAGED_ATTR);
    }

    if (config.howTo) {
      addJsonLdSchema(
        'HowTo',
        {
          name: config.howTo.name,
          description: config.howTo.description,
          totalTime: config.howTo.totalTime,
          step: config.howTo.steps.map(step => ({
            '@type': 'HowToStep',
            name: step.name,
            text: step.text,
            url: step.url,
            image: step.image,
          })),
        },
        AEO_MANAGED_ATTR
      );
    }

    if (config.entities?.length) {
      this.applyEntities(config.entities);
    }

    config.customAiMetaTags?.forEach(tag => {
      updateMeta(tag.name, tag.content, AEO_MANAGED_ATTR);
    });

    config.schema?.forEach(item => {
      addJsonLdSchema(item.type, item.data, AEO_MANAGED_ATTR);
    });

    config.jsonLd?.forEach(data => {
      addRawJsonLd(data, AEO_MANAGED_ATTR);
    });

    if (config.jsonLdGraph?.length) {
      addRawJsonLd(
        {
          '@context': 'https://schema.org',
          '@graph': config.jsonLdGraph,
        },
        AEO_MANAGED_ATTR
      );
    }
  }

  static resetAeo(): void {
    if (!isBrowser()) return;
    this.clearManaged();
  }

  /** Generates llms.txt markdown content for hosting at `/llms.txt`. */
  static generateLlmsTxt(config: LlmsTxtConfig): string {
    return generateLlmsTxt(config);
  }

  /** Returns machine-readable page summary JSON (without injecting into DOM). */
  static buildPageSummaryJson(summary: PageSummary): string {
    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: summary.title,
        description: summary.description,
        url: summary.url,
        inLanguage: summary.language,
        keyPoints: summary.keyPoints,
        topics: summary.topics,
        mentions: summary.entities?.map(entity => ({
          '@type': entity.type ?? 'Thing',
          name: entity.name,
          url: entity.url,
          sameAs: entity.sameAs,
          description: entity.description,
        })),
      },
      null,
      2
    );
  }

  private static clearManaged(): void {
    clearManaged(AEO_MANAGED_ATTR);
  }

  private static applyPageSummary(summary: PageSummary): void {
    updateMeta('abstract', summary.description, AEO_MANAGED_ATTR);
    updateMeta('summary', summary.description, AEO_MANAGED_ATTR);

    if (summary.topics?.length) {
      updateMeta('topic', summary.topics.join(', '), AEO_MANAGED_ATTR);
    }

    addPageSummaryJson(
      'aeo-page-summary',
      JSON.parse(this.buildPageSummaryJson(summary)) as Record<string, unknown>,
      AEO_MANAGED_ATTR
    );
  }

  private static applyAiRobots(
    robots: NonNullable<AeoConfig['aiRobots']>
  ): void {
    (Object.keys(robots) as string[]).forEach(bot => {
      const policy = robots[bot];
      if (policy) {
        updateMeta(bot, this.toAiRobotsContent(policy), AEO_MANAGED_ATTR);
      }
    });
  }

  private static toAiRobotsContent(policy: AiCrawlerPolicy): string {
    return policy === 'allow' ? 'index, follow' : 'noindex, nofollow';
  }

  private static applyLlmsTxtLink(url: string): void {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.type = 'text/plain';
    link.title = 'LLMs documentation index';
    link.href = url;
    appendLink(link, AEO_MANAGED_ATTR);
  }

  private static applyMarkdownLink(url: string): void {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.type = 'text/markdown';
    link.href = url;
    appendLink(link, AEO_MANAGED_ATTR);
  }

  private static applyCitationMeta(
    citation: NonNullable<AeoConfig['citation']>
  ): void {
    if (citation.author) updateMeta('author', citation.author, AEO_MANAGED_ATTR);
    if (citation.publishedAt) {
      updateMeta('article:published_time', citation.publishedAt, AEO_MANAGED_ATTR, 'property');
    }
    if (citation.modifiedAt) {
      updateMeta('article:modified_time', citation.modifiedAt, AEO_MANAGED_ATTR, 'property');
    }
    if (citation.license) updateMeta('license', citation.license, AEO_MANAGED_ATTR);
    if (citation.isBasedOn) updateMeta('isBasedOn', citation.isBasedOn, AEO_MANAGED_ATTR);
    if (citation.publisher) updateMeta('publisher', citation.publisher, AEO_MANAGED_ATTR);
  }

  private static applyEntities(
    entities: NonNullable<AeoConfig['entities']>
  ): void {
    addRawJsonLd(
      {
        '@context': 'https://schema.org',
        '@graph': entities.map(entity => ({
          '@type': entity.type ?? 'Thing',
          name: entity.name,
          url: entity.url,
          sameAs: entity.sameAs,
          description: entity.description,
        })),
      },
      AEO_MANAGED_ATTR
    );
  }

  private static buildFaqSchema(items: FaqItem[]): Record<string, unknown> {
    return {
      mainEntity: items.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
  }
}
