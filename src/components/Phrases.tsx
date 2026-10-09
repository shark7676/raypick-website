import { Fragment } from 'react';

/**
 * Text with line-break hints: "\n" is a hard line break, and "|" separates phrases that
 * each stay on one line — so narrow screens only wrap between phrases, never mid-phrase.
 */
export default function Phrases({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line.split('|').map((part, j, all) => (
            <Fragment key={j}>
              <span className="phrase">{part}</span>
              {j < all.length - 1 && ' '}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
}
