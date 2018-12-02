import crypto from 'crypto';

async function getResourceContent(url) {
  const response = await fetch(url);
  const text = await response.text();
  return text;
}

function getHash(type, content) {
  return crypto.createHash(type).update(content, 'utf8').digest('base64');
}

export async function getBase64HashFromUrl(types, url) {
  const content = await getResourceContent(url);
  return types.map(type => `${type}-${getHash(type, content)}`).join(' ');
}

function isStylesheet(url) {
  return url.indexOf('.css') > 0;
}

export function getResourceHTML(url, hash) {
  if (isStylesheet(url)) {
    return `<link href="${url}" rel="stylesheet" integrity="${hash}" crossorigin="anonymous" />`;
  } else {
    return `<script type="text/javascript" src="${url}" integrity="${hash}" crossorigin="anonymous"></script>`;
  }
}

function readContentFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.onabort = reject;
    reader.readAsText(file);
  });
}

export async function getBase64HashFromFile(types, file) {
  const content = await readContentFromFile(file);
  return types.map(type => `${type}-${getHash(type, content)}`).join(' ');
}
