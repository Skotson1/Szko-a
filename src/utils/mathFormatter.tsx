import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export const FormattedMathText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split by newlines to preserve paragraphs / numbered items
  const lines = text.split('\n');

  return (
    <div className={`space-y-1.5 leading-relaxed text-slate-800 dark:text-slate-200 ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // Check if line looks like a sub-point or math formula
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ');
        const isNumbered = /^[a-z0-9]+[\)\.]\s/i.test(trimmed);

        const renderedLine = formatInlineMath(trimmed);

        return (
          <p
            key={idx}
            className={`${isBullet ? 'pl-4 relative' : ''} ${isNumbered ? 'font-medium text-slate-900 dark:text-white' : ''}`}
          >
            {isBullet && <span className="absolute left-0 text-sky-600 dark:text-sky-400 font-bold">•</span>}
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
};

// Formats inline mathematical expressions, powers, symbols and code-like snippets
function formatInlineMath(text: string): React.ReactNode[] {
  // Regex pattern to catch math formulas or keywords in backticks `...` or special symbols
  // like cm³, m², √225, fractions like 1/2
  const parts = text.split(/(`[^`]+`|\b\d+\/\d+\b|cm³|m²|km²|g\/cm³|kg\/m³|hPa|Pa|\b[dFSpVmvabt]\s*=\s*[^,\.\n]+)/g);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-mono text-xs font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Fraction rendering e.g. 1/3, 8/24
    if (/^\d+\/\d+$/.test(part)) {
      const [num, den] = part.split('/');
      return (
        <span key={i} className="inline-flex flex-col items-center align-middle mx-1 text-xs font-semibold leading-none font-mono">
          <span className="border-b border-current pb-0.5 px-0.5">{num}</span>
          <span className="pt-0.5 px-0.5">{den}</span>
        </span>
      );
    }

    // Units and formulas
    if (part === 'cm³' || part === 'm²' || part === 'km²' || part === 'g/cm³' || part === 'kg/m³') {
      return (
        <span key={i} className="font-mono text-slate-700 dark:text-slate-300 font-medium">
          {part}
        </span>
      );
    }

    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
