import React from 'react';
import {
  parseFormattedText,
  type FormattedBlock,
  type InlineToken
} from '../utils/parseFormattedText';
import './FormattedText.css';

interface FormattedTextProps {
  text?: string;
  className?: string;
}

const renderInline = (tokens: InlineToken[], keyPrefix: string): React.ReactNode[] =>
  tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (token.type) {
      case 'text':
        return <React.Fragment key={key}>{token.value}</React.Fragment>;
      case 'bold':
        return <strong key={key}>{renderInline(token.children, key)}</strong>;
      case 'italic':
        return <em key={key}>{renderInline(token.children, key)}</em>;
      case 'link':
        return (
          <a
            key={key}
            href={token.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {renderInline(token.children, key)}
          </a>
        );
    }
  });

const renderBlock = (block: FormattedBlock, index: number): React.ReactNode => {
  if (block.type === 'paragraph') {
    return (
      <p key={index}>
        {block.lines.map((line, lineIndex) => (
          <React.Fragment key={`${index}-line-${lineIndex}`}>
            {lineIndex > 0 && <br />}
            {renderInline(line, `${index}-line-${lineIndex}`)}
          </React.Fragment>
        ))}
      </p>
    );
  }

  const ListTag = block.type === 'ul' ? 'ul' : 'ol';
  return (
    <ListTag key={index}>
      {block.items.map((item, itemIndex) => (
        <li key={`${index}-item-${itemIndex}`}>
          {renderInline(item, `${index}-item-${itemIndex}`)}
        </li>
      ))}
    </ListTag>
  );
};

const FormattedText: React.FC<FormattedTextProps> = ({ text, className }) => {
  const blocks = parseFormattedText(text || '');
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className={['formatted-text', className].filter(Boolean).join(' ')}>
      {blocks.map(renderBlock)}
    </div>
  );
};

export default FormattedText;
