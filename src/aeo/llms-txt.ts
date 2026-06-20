import type { LlmsTxtConfig } from './types';

function formatPageSection(title: string, pages: LlmsTxtConfig['pages']): string {
  if (!pages.length) return '';

  const lines = pages.map(page => {
    const summary = page.summary ? `: ${page.summary}` : '';
    return `- [${page.title}](${page.url})${summary}`;
  });

  return `## ${title}\n\n${lines.join('\n')}\n`;
}

/**
 * Generates an llms.txt markdown document for AI agents and crawlers.
 * Host the result at `https://yoursite.com/llms.txt`.
 */
export function generateLlmsTxt(config: LlmsTxtConfig): string {
  const sections = [
    `# ${config.siteName}`,
    '',
    `> ${config.description}`,
    '',
  ];

  if (config.details) {
    sections.push(config.details, '');
  }

  sections.push(formatPageSection('Docs', config.pages));

  if (config.optionalPages?.length) {
    sections.push(formatPageSection('Optional', config.optionalPages));
  }

  return sections.filter((line, index, arr) => {
    if (line !== '') return true;
    return arr[index - 1] !== '';
  }).join('\n').trim() + '\n';
}
