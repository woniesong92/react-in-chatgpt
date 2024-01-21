import React from 'react';
import ReactDOM from 'react-dom/client';
import { transform } from '@babel/standalone';

const CHROME_EXTENSION_ID = chrome.runtime.id;
const COPY_CODE = 'Copy code';

const babelCompile = (code, filename) =>
  transform(code, {
    filename: filename,
    plugins: [
      [
        'transform-modules-umd',
        {
          globals: { react: 'React', 'react-dom': 'ReactDOM' },
        },
      ],
    ],
    presets: ['react'],
  });

const transpileReactCodeToHTML = (reactCode) => {
  const compiledComponent = babelCompile(reactCode, `Component.jsx`);
  const appCode = `
      import React from 'react';
      import { createRoot } from 'react-dom';
      import Component from './Component.jsx';

      const App = () => {
        return (
          <>
            <Component />
          </>
        )
      }

      createRoot(document.querySelector("#root")).render(<App />)
    `;

  const compiledApp = babelCompile(appCode, 'index.jsx');
  const html = `
  <html>
    <head>
      <style>
        html, body {
          width: 100%;
          height: 100%;
          background: white;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script defer src="chrome-extension://${CHROME_EXTENSION_ID}/react.production.min.js"></script>
      <script defer src="chrome-extension://${CHROME_EXTENSION_ID}/react-dom.production.min.js"></script>
      <script defer src="chrome-extension://${CHROME_EXTENSION_ID}/tailwind.min.js"></script>
      <script defer>window.addEventListener("DOMContentLoaded", () => {${[
        compiledComponent.code,
        compiledApp.code,
      ].join('\n')}});</script>
    </body>
  </html>`;
  return html;
};

const ComponentRenderer = ({ code }) => {
  const html = transpileReactCodeToHTML(code);

  return (
    <div>
      <iframe
        title="code"
        srcDoc={html}
        style={{
          marginTop: '10px',
          width: '100%',
          height: '500px',
          borderRadius: '10px',
          background: 'black',
          padding: '1rem',
        }}
      ></iframe>
    </div>
  );
};

function findNearestParentWithTag(elem, tagName) {
  while (elem && elem !== document) {
    if (elem.tagName === tagName.toUpperCase()) {
      return elem;
    }
    elem = elem.parentNode;
  }
  return null;
}

document.addEventListener(
  'click',
  function (event) {
    const element = event.target;
    const textContent = element.textContent;

    if (textContent === COPY_CODE) {
      const widthOfRenderComponentText = 110;
      const leftEnd = element.getBoundingClientRect().x;
      const rightEnd = leftEnd + widthOfRenderComponentText;
      const mouseClickX = event.x;

      if (mouseClickX >= leftEnd && mouseClickX <= rightEnd) {
        event.stopPropagation();

        const preElement = findNearestParentWithTag(element, 'pre');
        const codeElement = preElement.querySelector('code');
        const code = codeElement.textContent;

        const rootContainer = document.createElement('div');
        rootContainer.id = 'react-container';
        preElement.appendChild(rootContainer);

        const root = ReactDOM.createRoot(rootContainer);
        root.render(<ComponentRenderer code={code} />);
        rootContainer.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  true
);
