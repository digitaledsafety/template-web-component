// Define the custom element class
export class HelloWorld extends HTMLElement {
  constructor() {
    super();
    // Attach an open Shadow DOM to isolate styles and markup
    const shadow = this.attachShadow({ mode: 'open' });
    
    // Set the inner HTML of the shadow root
    shadow.innerHTML = `
      <style>
        p {
          font-family: sans-serif;
          color: #0076d6;
          font-weight: bold;
        }
      </style>
      <p>Hello, World!</p>
    `;
  }
}

// Register the custom element with a hyphenated tag name
customElements.define('hello-world', HelloWorld);
