import type {AIResponseBlock,AIResponseInline} from './ai-response-types';

/** Limited source markdown grammar, including streaming/incomplete blocks. */
export function parseAIResponseMarkdown(raw: string): AIResponseBlock[] {
  const blocks: AIResponseBlock[] = [];
  const lines = raw.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trim().startsWith('```')) {
      const language = line.trim().replace(/^```/, '') || 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'code',
        language,
        content: codeLines.join('\n'),
      });
      i++;
      continue;
    }

    // Markdown Table
    if (line.includes('|') && lines[i + 1] && lines[i + 1].includes('|') && lines[i + 1].includes('-')) {
      const headers = line.split('|').map((s) => s.trim()).filter(Boolean);
      i += 2; // skip header + divider
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|')) {
        const row = lines[i].split('|').map((s) => s.trim()).filter(Boolean);
        if (row.length > 0) rows.push(row);
        i++;
      }
      blocks.push({
        type: 'table',
        headers,
        rows,
      });
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      blocks.push({ type: 'heading', level: 1, content: line.slice(2) });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, content: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, content: line.slice(4) });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({
        type: 'blockquote',
        content: quoteLines.join('\n'),
      });
      continue;
    }

    // Bullet List
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({
        type: 'list',
        items,
      });
      continue;
    }

    // Empty line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('> ') &&
      !lines[i].trim().startsWith('- ') &&
      !lines[i].trim().startsWith('* ')
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    // Unsupported heading markers must still consume input (for example ####).
    if (paraLines.length === 0) paraLines.push(lines[i++]);
    blocks.push({
      type: 'paragraph',
      content: paraLines.join(' '),
    });
  }

  return blocks;
}

/** Inline tokens retain the source's non-nested bold/code/link grammar. */
export function aiResponseInline(text:string):AIResponseInline[]{
 const parts:AIResponseInline[]=[];const regex=/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;let lastIndex=0,match:RegExpExecArray|null;
 while((match=regex.exec(text))!==null){if(match.index>lastIndex)parts.push({type:'text',text:text.substring(lastIndex,match.index)});const token=match[0];if(token.startsWith('**')&&token.endsWith('**'))parts.push({type:'strong',text:token.slice(2,-2)});else if(token.startsWith('`')&&token.endsWith('`'))parts.push({type:'code',text:token.slice(1,-1)});else{const title=token.match(/\[(.*?)\]/),url=token.match(/\((.*?)\)/);if(title&&url)parts.push({type:'link',text:title[1],url:url[1]})}lastIndex=regex.lastIndex;}
 if(lastIndex<text.length)parts.push({type:'text',text:text.substring(lastIndex)});return parts;
}
