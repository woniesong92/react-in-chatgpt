## React in ChatGPT

React in ChatGPT is a Chrome Extension that lets you render React components with tailwindcss directly in ChatGPT

### Demo

![demo](https://github.com/woniesong92/react-in-chatgpt/assets/2935309/f550d2ab-00c1-47c9-87c7-c12ba7616b38)

### Quickstart

1. Install the [Chrome Extension](https://chromewebstore.google.com/detail/react-in-chatgpt/mpgcjbncjpngijjgkmkkgmhpdjnmbgif)
2. Go to ChatGPT
3. Ask ChatGPT to write a React component for you (e.g. "Write a simple React component for a SignUpForm with tailwindcss")
4. Click the "Render component" button next to the "Copy code" button

### Development

1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Go to chrome://extensions in your browser
5. Enable the developer mode
6. Click "Load unpacked" button and select the `/build` folder

### Build

1. Run `NODE_ENV=production npm run build`
2. Submit the contents in the `/build` following the [official publishing guide](https://developer.chrome.com/docs/webstore/publish)

Note that only the changes in the `Popup` component are hot reloaded. For changes in other surfaces (e.g. Content Script), you have to reload the chrome extension and refresh the webpage to see the changes in effect.

### References

- [Chrome Extension Boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react)
