export type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'bold'; children: InlineToken[] }
  | { type: 'italic'; children: InlineToken[] }
  | { type: 'link'; href: string; children: InlineToken[] };

export type FormattedBlock =
  | { type: 'paragraph'; lines: InlineToken[][] }
  | { type: 'ul'; items: InlineToken[][] }
  | { type: 'ol'; items: InlineToken[][] };

const UNORDERED_ITEM_RE = /^\s*[-*•・]\s+/;
const ORDERED_ITEM_RE = /^\s*\d+[.)]\s+/;
const INLINE_PATTERN = '\\*\\*(.+?)\\*\\*|\\*(.+?)\\*|\\[([^\\]]+)\\]\\(([^)\\s]+)\\)';

export function sanitizeHttpUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    return null;
  }
  return null;
}

export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;
  const inlineRe = new RegExp(INLINE_PATTERN, 'g');

  let match: RegExpExecArray | null;
  while ((match = inlineRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }

    if (match[1] !== undefined) {
      tokens.push({ type: 'bold', children: parseInline(match[1]) });
    } else if (match[2] !== undefined) {
      tokens.push({ type: 'italic', children: parseInline(match[2]) });
    } else if (match[3] !== undefined && match[4] !== undefined) {
      const href = sanitizeHttpUrl(match[4]);
      if (href) {
        tokens.push({ type: 'link', href, children: parseInline(match[3]) });
      } else {
        tokens.push({ type: 'text', value: match[0] });
      }
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return tokens;
}

function stripUnorderedMarker(line: string): string {
  return line.replace(UNORDERED_ITEM_RE, '');
}

function stripOrderedMarker(line: string): string {
  return line.replace(ORDERED_ITEM_RE, '');
}

export function parseFormattedText(text: string): FormattedBlock[] {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!normalized) {
    return [];
  }

  const blocks: FormattedBlock[] = [];

  for (const chunk of normalized.split(/\n{2,}/)) {
    const lines = chunk.split('\n');
    const contentLines = lines.filter((line) => line.trim() !== '');
    if (contentLines.length === 0) {
      continue;
    }

    if (contentLines.every((line) => UNORDERED_ITEM_RE.test(line))) {
      blocks.push({
        type: 'ul',
        items: contentLines.map((line) => parseInline(stripUnorderedMarker(line)))
      });
      continue;
    }

    if (contentLines.every((line) => ORDERED_ITEM_RE.test(line))) {
      blocks.push({
        type: 'ol',
        items: contentLines.map((line) => parseInline(stripOrderedMarker(line)))
      });
      continue;
    }

    blocks.push({
      type: 'paragraph',
      lines: lines.map((line) => parseInline(line))
    });
  }

  return blocks;
}
