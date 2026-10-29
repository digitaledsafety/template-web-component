import { describe, it, expect, beforeEach } from 'vitest';
import '../src/define.js';
import { HelloWorld } from '../src/index.js';

describe('HelloWorld Web Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should be defined in customElements registry', () => {
    expect(customElements.get('hello-world')).toBe(HelloWorld);
  });

  it('renders default greeting when name attribute is not set', () => {
    const element = document.createElement('hello-world');
    document.body.appendChild(element);

    const shadowRoot = element.shadowRoot;
    expect(shadowRoot).not.toBeNull();

    const p = shadowRoot.querySelector('p');
    expect(p).not.toBeNull();
    expect(p.textContent).toBe('Hello, World!');
  });

  it('renders customized greeting when name attribute is provided', () => {
    const element = document.createElement('hello-world');
    element.setAttribute('name', 'Vitest');
    document.body.appendChild(element);

    const p = element.shadowRoot.querySelector('p');
    expect(p.textContent).toBe('Hello, Vitest!');
  });

  it('updates textContent dynamically when name property is set', async () => {
    const element = document.createElement('hello-world');
    document.body.appendChild(element);

    element.name = 'Alice';
    expect(element.getAttribute('name')).toBe('Alice');

    const p = element.shadowRoot.querySelector('p');
    expect(p.textContent).toBe('Hello, Alice!');
  });

  it('removes name attribute when set to null or undefined', () => {
    const element = document.createElement('hello-world');
    element.name = 'Bob';
    expect(element.getAttribute('name')).toBe('Bob');

    element.name = null;
    expect(element.hasAttribute('name')).toBe(false);
    expect(element.name).toBe('World');
  });

  it('prevents XSS by rendering HTML string as plain text content', () => {
    const xssPayload = '<script>alert("xss")</script><img src=x onerror=alert(1)>';
    const element = document.createElement('hello-world');
    element.setAttribute('name', xssPayload);
    document.body.appendChild(element);

    const p = element.shadowRoot.querySelector('p');
    expect(p.textContent).toBe(`Hello, ${xssPayload}!`);
    expect(p.children.length).toBe(0);
    expect(element.shadowRoot.querySelector('script')).toBeNull();
    expect(element.shadowRoot.querySelector('img')).toBeNull();
  });

  it('falls back to <style> element when adoptedStyleSheets is not supported', () => {
    const originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (options) {
      const shadow = originalAttachShadow.call(this, options);
      Object.defineProperty(shadow, 'adoptedStyleSheets', {
        get: () => undefined,
        configurable: true,
      });
      return shadow;
    };

    try {
      const element = document.createElement('hello-world');
      document.body.appendChild(element);

      const styleTag = element.shadowRoot.querySelector('style');
      expect(styleTag).not.toBeNull();
      expect(styleTag.textContent).toContain(':host');
      expect(styleTag.textContent).toContain('#0076d6');
    } finally {
      Element.prototype.attachShadow = originalAttachShadow;
    }
  });

  it('supports custom element registration under an alternate tag name via subclassing', () => {
    class MyCustomHello extends HelloWorld {}

    if (!customElements.get('my-custom-hello')) {
      customElements.define('my-custom-hello', MyCustomHello);
    }

    const customElem = document.createElement('my-custom-hello');
    document.body.appendChild(customElem);

    const p = customElem.shadowRoot.querySelector('p');
    expect(p.textContent).toBe('Hello, World!');
  });
});
