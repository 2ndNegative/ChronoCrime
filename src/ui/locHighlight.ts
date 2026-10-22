import { MISSING_CLOSE, MISSING_OPEN } from '../loc/loc';

const HIGHLIGHT_NAME = 'missing-loc';
const REFRESH_MS = 500;

/**
 * Highlights every unwritten text (‹key›) on screen, using the CSS Custom Highlight API.
 * It marks text ranges without touching the DOM, so React is unaffected. Styled in style.css
 * via ::highlight(missing-loc). Browsers without the API simply show no highlight.
 */
export function startLocHighlight(): void {
  if (typeof CSS === 'undefined' || !('highlights' in CSS)) return;
  const refresh = () => {
    if (document.hidden) return;
    const ranges: Range[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent ?? '';
      let start = text.indexOf(MISSING_OPEN);
      while (start !== -1) {
        const end = text.indexOf(MISSING_CLOSE, start);
        if (end === -1) break;
        const range = new Range();
        range.setStart(node, start);
        range.setEnd(node, end + 1);
        ranges.push(range);
        start = text.indexOf(MISSING_OPEN, end);
      }
    }
    CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(...ranges));
  };
  refresh();
  setInterval(refresh, REFRESH_MS);
}
