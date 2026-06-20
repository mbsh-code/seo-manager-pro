import type {
  AeoArticlePresetInput,
  AeoConfig,
  AeoFaqPresetInput,
  AeoHowToPresetInput,
  AeoProductPresetInput,
  FaqItem,
} from './types';

function buildFaqSchema(items: FaqItem[]): Record<string, unknown> {
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

/** Ready-made AEO configs that AI coding tools can fill with minimal fields. */
export class AeoPresets {
  static article(input: AeoArticlePresetInput): AeoConfig {
    return {
      pageSummary: {
        title: input.title,
        description: input.description,
        url: input.url,
        keyPoints: input.keyPoints,
        topics: input.topics,
      },
      citation: {
        author: input.author,
        publishedAt: input.publishedAt,
        modifiedAt: input.modifiedAt ?? input.publishedAt,
      },
      faq: input.faq,
      schema: [
        {
          type: 'BlogPosting',
          data: {
            headline: input.title,
            description: input.description,
            url: input.url,
            author: { '@type': 'Person', name: input.author },
            datePublished: input.publishedAt,
            dateModified: input.modifiedAt ?? input.publishedAt,
          },
        },
      ],
      aiRobots: {
        GPTBot: 'allow',
        ClaudeBot: 'allow',
        PerplexityBot: 'allow',
      },
    };
  }

  static product(input: AeoProductPresetInput): AeoConfig {
    return {
      pageSummary: {
        title: input.name,
        description: input.description,
        url: input.url,
        entities: input.brand
          ? [{ name: input.brand, type: 'Brand' }]
          : undefined,
      },
      faq: input.faq,
      schema: [
        {
          type: 'Product',
          data: {
            name: input.name,
            description: input.description,
            url: input.url,
            brand: input.brand ? { '@type': 'Brand', name: input.brand } : undefined,
            offers: {
              '@type': 'Offer',
              price: input.price,
              priceCurrency: input.currency,
              availability: 'https://schema.org/InStock',
            },
          },
        },
      ],
      aiRobots: {
        GPTBot: 'allow',
        ClaudeBot: 'allow',
        PerplexityBot: 'allow',
      },
    };
  }

  static faq(input: AeoFaqPresetInput): AeoConfig {
    return {
      pageSummary: {
        title: input.title,
        description: input.description,
        url: input.url,
        keyPoints: input.items.map(item => item.question),
      },
      faq: input.items,
      schema: [
        {
          type: 'FAQPage',
          data: buildFaqSchema(input.items),
        },
      ],
      aiRobots: {
        GPTBot: 'allow',
        ClaudeBot: 'allow',
        PerplexityBot: 'allow',
      },
    };
  }

  static howTo(input: AeoHowToPresetInput): AeoConfig {
    return {
      pageSummary: {
        title: input.title,
        description: input.description,
        url: input.url,
        keyPoints: input.steps.map(step => step.name),
      },
      howTo: {
        name: input.title,
        description: input.description,
        totalTime: input.totalTime,
        steps: input.steps,
      },
      schema: [
        {
          type: 'HowTo',
          data: {
            name: input.title,
            description: input.description,
            totalTime: input.totalTime,
            step: input.steps.map(step => ({
              '@type': 'HowToStep',
              name: step.name,
              text: step.text,
              url: step.url,
              image: step.image,
            })),
          },
        },
      ],
      aiRobots: {
        GPTBot: 'allow',
        ClaudeBot: 'allow',
        PerplexityBot: 'allow',
      },
    };
  }
}
