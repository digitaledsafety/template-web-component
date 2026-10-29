const COMPONENT_STYLES = `
  :host {
    display: inline-block;
    box-sizing: border-box;
  }
  p {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    color: #0076d6;
    font-weight: bold;
    margin: 0;
    padding: 0.5rem 1rem;
    border: 1px solid #0076d6;
    border-radius: 4px;
    background-color: #f4f9ff;
  }
`;

let sharedStyleSheet = null;
if (typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype) {
  try {
    sharedStyleSheet = new CSSStyleSheet();
    sharedStyleSheet.replaceSync(COMPONENT_STYLES);
  } catch {
    sharedStyleSheet = null;
  }
}

export class HelloWorld extends HTMLElement {
  static get observedAttributes() {
    return ['name'];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    if (shadow.adoptedStyleSheets && sharedStyleSheet) {
      shadow.adoptedStyleSheets = [sharedStyleSheet];
    } else {
      const styleTag = document.createElement('style');
      styleTag.textContent = COMPONENT_STYLES;
      shadow.appendChild(styleTag);
    }

    this._paragraph = document.createElement('p');
    shadow.appendChild(this._paragraph);
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._render();
    }
  }

  get name() {
    return this.getAttribute('name') || 'World';
  }

  set name(value) {
    if (value === null || value === undefined) {
      this.removeAttribute('name');
    } else {
      this.setAttribute('name', value);
    }
  }

  _render() {
    if (this._paragraph) {
      this._paragraph.textContent = `Hello, ${this.name}!`;
    }
  }
}
