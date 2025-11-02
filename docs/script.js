/* CSS Playground — Monaco Editor + Live Preview + Explainer */

const statusEl  = document.getElementById('status');
const preview   = document.getElementById('preview');

const ui = {
  context:  document.getElementById('context'),
  selector: document.getElementById('selector'),
  prop:     document.getElementById('prop'),
  val:      document.getElementById('val'),
  desc:     document.getElementById('desc'),
};

const SAMPLE_HTML = `
<div class="card">
  <h1>Hello, CSS!</h1>
  <p>Change the CSS to style this preview. Move your caret over a property to learn what it does.</p>
  <button class="cta">Click me</button>
</div>
`.trim();

const SAMPLE_CSS = `
:root { --brand: #5b8def; }

body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  background: #f7f7f8;
  color: #222;
}

.card {
  max-width: 640px;
  margin: 40px auto;
  padding: 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,.06);
}

h1 {
  margin: 0 0 10px;
  font-size: 28px;
  letter-spacing: .2px;
}

p {
  line-height: 1.6;
  color: #444;
}

.cta {
  margin-top: 14px;
  padding: 10px 16px;
  background: var(--brand);
  color: white;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  transition: transform .08s ease, box-shadow .2s ease;
}
.cta:hover { box-shadow: 0 6px 18px rgba(91,141,239,.35); }
.cta:active { transform: translateY(1px); }
`.trim();

/* Lightweight CSS reference for the explainer */
const CSS_REF = {
  properties: {
    'color': { d: 'Sets the text color.', ex: 'color: #333;' },
    'background': { d: 'Shorthand for all background-* properties.', ex: 'background: #fff url(img.png) no-repeat center/cover;' },
    'background-color': { d: 'Background fill color of an element.', ex: 'background-color: #f0f3f9;' },
    'border': { d: 'Shorthand for border-width, style, and color.', ex: 'border: 1px solid #e5e7eb;' },
    'border-radius': { d: 'Rounds the corners of the element box.', ex: 'border-radius: 12px;' },
    'box-shadow': { d: 'Adds one or more drop shadows to the box.', ex: 'box-shadow: 0 10px 30px rgba(0,0,0,.12);' },
    'display': { d: 'Defines how an element is displayed in layout.', ex: 'display: grid;' },
    'position': { d: 'Positioning scheme for the element.', ex: 'position: absolute; top: 0; left: 0;' },
    'z-index': { d: 'Stacking order for positioned elements.', ex: 'z-index: 10;' },
    'overflow': { d: 'What happens when content overflows the box.', ex: 'overflow: auto;' },
    'opacity': { d: 'Transparency of the element (0–1).', ex: 'opacity: .8;' },
    'width': { d: 'Preferred horizontal size of the content box.', ex: 'width: 320px;' },
    'max-width': { d: 'Maximum width the element can grow to.', ex: 'max-width: 640px;' },
    'height': { d: 'Preferred vertical size of the content box.', ex: 'height: 200px;' },
    'padding': { d: 'Space inside the border around content.', ex: 'padding: 16px 24px;' },
    'margin': { d: 'Space outside the border around the element.', ex: 'margin: 24px auto;' },
    'gap': { d: 'Spacing between rows/columns in grid/flex.', ex: 'gap: 12px;' },
    'align-items': { d: 'Cross-axis alignment in flex/grid containers.', ex: 'align-items: center;' },
    'justify-content': { d: 'Main-axis distribution in flex/grid.', ex: 'justify-content: space-between;' },
    'flex': { d: 'Shorthand for flex-grow, shrink, basis.', ex: 'flex: 1 1 auto;' },
    'grid-template-columns': { d: 'Defines column track sizes.', ex: 'grid-template-columns: 1fr 1fr 2fr;' },
    'place-items': { d: 'Shorthand for align-items and justify-items.', ex: 'place-items: center;' },
    'font-size': { d: 'Size of glyphs.', ex: 'font-size: 18px;' },
    'font-weight': { d: 'Thickness of glyphs.', ex: 'font-weight: 600;' },
    'line-height': { d: 'Space between baselines.', ex: 'line-height: 1.6;' },
    'letter-spacing': { d: 'Tracking; space between letters.', ex: 'letter-spacing: .2px;' },
    'text-align': { d: 'Horizontal text alignment.', ex: 'text-align: center;' },
    'text-shadow': { d: 'Shadow effect for text glyphs.', ex: 'text-shadow: 0 1px 2px rgba(0,0,0,.2);' },
    'cursor': { d: 'Mouse cursor appearance.', ex: 'cursor: pointer;' },
    'transition': { d: 'Shorthand for transition-* properties.', ex: 'transition: transform .1s ease;' },
    'transform': { d: '2D/3D transformation of the element box.', ex: 'transform: translateY(2px) scale(1.02);' },
  },
  selectors: {
    '*': 'Universal selector — matches any element.',
    'element': 'Type selector — matches elements by tag name, e.g., div or h1.',
    '.class': 'Class selector — matches elements with a class.',
    '#id': 'ID selector — matches the element with this id.',
    '[attr]': 'Attribute selector — element carrying the given attribute.',
    ':hover': 'Pseudo-class — element in a hovered state.',
    ':active': 'Pseudo-class — element in an active (pressed) state.',
    ':focus': 'Pseudo-class — element that currently has focus.',
    '::before / ::after': 'Pseudo-elements — virtual elements before/after content.',
    'A B': 'Descendant combinator — B anywhere inside A.',
    'A > B': 'Child combinator — B is a direct child of A.',
    'A + B': 'Adjacent sibling — B immediately follows A.',
    'A ~ B': 'General sibling — B follows A with same parent.'
  }
};

/* Monaco boot */
let monacoHTML, monacoCSS;

function defineTheme(monaco) {
  monaco.editor.defineTheme('playground-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', background: '1e1f26' },
    ],
    colors: {
      'editor.background': '#121317',
      'editor.lineHighlightBackground': '#1a1b21',
      'editorCursor.foreground': '#7aa2f7',
      'editor.selectionBackground': '#264f7848',
      'editorIndentGuide.activeBackground': '#3b3f51',
    }
  });
}

function createEditors(monaco) {
  defineTheme(monaco);

  const htmlModel = monaco.editor.createModel(SAMPLE_HTML, 'html');
  const cssModel  = monaco.editor.createModel(SAMPLE_CSS, 'css');

  monacoHTML = monaco.editor.create(document.getElementById('htmlEditor'), {
    model: htmlModel,
    theme: 'playground-dark',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    fontSize: 13,
    minimap: { enabled: false },
    automaticLayout: true,
    wordWrap: 'on',
    scrollBeyondLastLine: false,
  });

  monacoCSS = monaco.editor.create(document.getElementById('cssEditor'), {
    model: cssModel,
    theme: 'playground-dark',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    fontSize: 13,
    minimap: { enabled: false },
    automaticLayout: true,
    wordWrap: 'on',
    scrollBeyondLastLine: false,
    // Enable rich suggestions
    suggest: { showWords: true, showSnippets: true },
    quickSuggestions: { other: true, comments: true, strings: true },
  });

  // Add custom CSS completions (extra goodies)
  registerCSSCompletions(monaco);

  // Re-render preview on changes (debounced)
  const debouncedRender = debounce(() => { render(); explain(); }, 120);
  monacoHTML.onDidChangeModelContent(debouncedRender);
  monacoCSS.onDidChangeModelContent(debouncedRender);

  // Update explainer on cursor moves
  monacoCSS.onDidChangeCursorPosition(explain);
  monacoCSS.onDidBlurEditorWidget(explain);

  // Wire buttons
  document.getElementById('formatBtn').addEventListener('click', () => {
    formatCSSInEditor(monaco);
    render(); explain();
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    htmlModel.setValue(SAMPLE_HTML);
    cssModel.setValue(SAMPLE_CSS);
    render(); explain();
  });

  // Initial paint
  render();
  explain();
}

function registerCSSCompletions(monaco) {
  // Basic extra property/value snippets + docs on top of Monaco’s built-ins
  const props = Object.keys(CSS_REF.properties);

  monaco.languages.registerCompletionItemProvider('css', {
    triggerCharacters: [':', '-', ' ', '\n'],
    provideCompletionItems(model, position) {
      const textUntilPos = model.getValueInRange({
        startLineNumber: 1, startColumn: 1,
        endLineNumber: position.lineNumber, endColumn: position.column
      });

      const line = model.getLineContent(position.lineNumber);
      const before = line.slice(0, position.column - 1);

      const items = [];

      // If we're typing a property (before ':')
      if (!before.includes(':')) {
        for (const p of props) {
          const ref = CSS_REF.properties[p];
          items.push({
            label: p,
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: `${p}: $0;`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: { value: `**${p}** — ${ref.d}\n\n\`e.g.\` ${ref.ex}` },
            range: undefined
          });
        }
      } else {
        // Likely typing a value; suggest common values
        const m = before.match(/([-\w]+)\s*:\s*([^\;]*)$/);
        const prop = m?.[1];
        if (prop) {
          const common = COMMON_VALUES[prop] || [];
          for (const v of common) {
            items.push({
              label: v,
              kind: monaco.languages.CompletionItemKind.Value,
              insertText: v,
              documentation: `Value for \`${prop}\``,
            });
          }
        }
      }

      // Handy snippets
      items.push(
        snippet('Center with Flex', 'display: flex; justify-content: center; align-items: center;'),
        snippet('Transition', 'transition: ${1:all} ${2:.2s} ${3:ease-in-out};'),
        snippet('Shadow Soft', 'box-shadow: 0 6px 20px rgba(0,0,0,.06);'),
        snippet('Rounded', 'border-radius: ${1:12px};'),
      );

      return { suggestions: items };
    }
  });

  function snippet(label, body) {
    return {
      label,
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: body,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Snippet',
    };
  }
}

const COMMON_VALUES = {
  display: ['block', 'inline', 'inline-block', 'flex', 'grid', 'none'],
  position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
  'justify-content': ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
  'align-items': ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
  'text-align': ['left', 'center', 'right', 'justify'],
  'border-style': ['solid', 'dashed', 'dotted', 'double', 'none'],
  cursor: ['pointer', 'default', 'move', 'text', 'not-allowed'],
  'box-sizing': ['content-box', 'border-box'],
  'overflow': ['visible', 'hidden', 'scroll', 'auto', 'clip'],
  'white-space': ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line'],
};

function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), ms); };
}

/* Build and load the preview document (HTML+CSS only, no scripts). */
function render() {
  const html = monacoHTML.getValue();
  const css  = monacoCSS.getValue();

  const doc = `
<!doctype html><html><head>
<meta charset="utf-8"/>
<style id="user-css">${css}</style>
<style id="hl-css">.✳️hl{outline: 2px dashed #5b8def99; outline-offset: 2px; transition: outline-color .4s ease}</style>
</head><body>${html}</body></html>`;

  preview.srcdoc = doc;
  statusEl.textContent = 'Rendered';
  setTimeout(()=>statusEl.textContent='Ready', 400);
}

/* Parse caret context in CSS Monaco model */
function getCaretContext() {
  const model = monacoCSS.getModel();
  const pos   = monacoCSS.getPosition();

  const lineText = model.getLineContent(pos.lineNumber);
  const line = lineText.trim();

  const text = model.getValue();
  const offset = model.getOffsetAt(pos);
  const upToPos = text.slice(0, offset);

  // selector by scanning back to last '{'
  const open = upToPos.lastIndexOf('{');
  const close = upToPos.lastIndexOf('}');
  let selector = null;
  if (open > close) {
    const before = upToPos.slice(0, open);
    const selLineStart = Math.max(before.lastIndexOf('\n'), 0);
    selector = before.slice(selLineStart, open).trim();
  } else if (line.endsWith('{')) {
    selector = line.slice(0, -1).trim();
  }

  let property = null, value = null;
  const pvMatch = line.match(/^\s*([-\w]+)\s*:\s*(.*?)\s*;?\s*$/);
  if (pvMatch) { property = pvMatch[1]; value = pvMatch[2]; }

  return { selector, property, value, line };
}

/* Update explainer panel + temporarily highlight elements that match selector */
let hlTimer = null;
function explain() {
  const { selector, property, value, line } = getCaretContext();

  ui.context.textContent  = line || '—';
  ui.selector.textContent = selector || '—';
  ui.prop.textContent     = property || '—';
  ui.val.textContent      = value || '—';

  if (property && CSS_REF.properties[property]) {
    const ref = CSS_REF.properties[property];
    ui.desc.innerHTML = `<b>${property}</b>: ${ref.d}<br><code>e.g. ${ref.ex}</code>`;
  } else if (selector) {
    ui.desc.textContent = selectorInfo(selector);
  } else {
    ui.desc.textContent = 'Place the caret inside a selector or on a property to see an explanation.';
  }

  highlightSelector(selector);
}

function selectorInfo(sel) {
  const tidy = sel.replace(/\s+/g, ' ').trim();
  if (CSS_REF.selectors[tidy]) return CSS_REF.selectors[tidy];
  if (/^\./.test(tidy)) return 'Class selector — matches elements with this class.';
  if (/^#/.test(tidy)) return 'ID selector — matches the element with this ID.';
  if (/^[a-z-]+$/.test(tidy)) return 'Type selector — matches all <' + tidy + '> elements.';
  if (/\[.+\]/.test(tidy)) return 'Attribute selector — matches elements by attribute/value.';
  if (/:/.test(tidy)) return 'Pseudo-class/element selector.';
  if (/>|\+|~/.test(tidy)) return 'Combinator selector.';
  return 'Selector.';
}

function highlightSelector(selector) {
  if (!selector) return;
  const win = preview.contentWindow; if (!win) return;
  const doc = win.document;
  try {
    const nodes = doc.querySelectorAll(selector);
    nodes.forEach(n => n.classList.add('✳️hl'));
    clearTimeout(hlTimer);
    hlTimer = setTimeout(() => nodes.forEach(n => n.classList.remove('✳️hl')), 600);
  } catch {
    // invalid selector
  }
}

/* Format CSS via Monaco formatting provider (fallback to simple formatter) */
function formatCSSInEditor(monaco) {
  const model = monacoCSS.getModel();
  monaco.languages.css.cssDefaults.setOptions({ format: { newlineBetweenSelectors: true } });
  const p = monaco.editor.getAction('editor.action.formatDocument');
  if (p) p.run().catch(()=> simpleFormat(model));
  else simpleFormat(model);

  function simpleFormat(model) {
    const v = model.getValue()
      .replace(/\s*{\s*/g, " {\n  ")
      .replace(/\s*;\s*/g, ";\n  ")
      .replace(/\s*}\s*/g, "\n}\n")
      .replace(/\n\s*\n\s*\n+/g, "\n\n")
      .replace(/\n  \}/g, "\n}");
    model.setValue(v);
  }
}

/* Bootstrap Monaco via AMD loader */
function boot() {
  require(['vs/editor/editor.main'], () => {
    // Configure languages (HTML/CSS diagnostics)
    const { languages } = window.monaco;

    languages.html.htmlDefaults.setOptions({
      format: { wrapAttributes: 'force-expand-multiline' }
    });

    languages.css.cssDefaults.setOptions({
      validate: true, lint: {
        unknownProperties: 'warning',
        duplicateProperties: 'warning',
        emptyRules: 'warning',
      }
    });

    createEditors(window.monaco);
  });
}

document.addEventListener('DOMContentLoaded', boot);
