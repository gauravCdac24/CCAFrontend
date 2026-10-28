import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/pdf.worker.min.mjs`;

const PRINT_STYLES = `
  @page { size: A4; margin: 12mm; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    color: #000;
    margin: 0;
    padding: 16px;
  }
  h1 { font-size: 18px; margin: 0 0 8px; }
  h2 { font-size: 14px; margin: 20px 0 8px; border-bottom: 1px solid #333; padding-bottom: 4px; }
  h3 { font-size: 13px; margin: 16px 0 8px; }
  .meta { color: #444; margin-bottom: 16px; }
  .fields * { max-width: 100% !important; box-sizing: border-box; }
  .fields button,
  .fields [data-print-hide],
  .fields a[data-print-hide],
  .fields .MuiSvgIcon-root,
  .fields .MuiRadio-root,
  .fields .MuiCheckbox-root,
  .fields .MuiIconButton-root { display: none !important; }
  .fields .MuiGrid-root {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    flex-basis: auto !important;
    padding: 0 !important;
    margin: 0 0 4px !important;
  }
  .fields .MuiGrid-container {
    display: block !important;
    margin: 0 0 8px !important;
  }
  .print-choice-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 28px;
    align-items: center;
    page-break-inside: avoid;
    break-inside: avoid;
    margin: 2px 0 10px;
  }
  .print-choice {
    white-space: nowrap;
    font-size: 12px;
    line-height: 1.4;
  }
  .print-choice.selected {
    font-weight: 700;
  }
  .print-choice .mark {
    font-family: "Segoe UI Symbol", "Arial Unicode MS", sans-serif;
    margin-right: 4px;
  }
  .doc-block {
    page-break-before: always;
    break-before: page;
    margin-top: 12px;
  }
  .doc-block:first-of-type {
    page-break-before: auto;
    break-before: auto;
  }
  .doc-page {
    page-break-inside: avoid;
    margin: 8px 0 16px;
    text-align: center;
  }
  .doc-page img {
    max-width: 100%;
    height: auto;
    border: 1px solid #ccc;
  }
  .note { color: #666; font-style: italic; }
  .error { color: #b00020; }
`;

const cleanChoiceLabel = (text) =>
  String(text || '')
    .replace(/[✓✔☑☒●○◻◼]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const isChoiceChecked = (item) => {
  if (item.classList?.contains('Mui-checked')) {
    return true;
  }
  if (item.querySelector?.('.Mui-checked, .MuiRadio-root.Mui-checked, .MuiCheckbox-root.Mui-checked')) {
    return true;
  }
  const input = item.querySelector?.('input[type="radio"], input[type="checkbox"]');
  if (input) {
    if (input.checked || input.getAttribute('checked') !== null) {
      return true;
    }
  }
  return false;
};

const buildPrintChoiceGroup = (items, { radio = true } = {}) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'print-choice-group';
  items.forEach((item) => {
    const checked = isChoiceChecked(item);
    const labelNode = item.querySelector?.('.MuiFormControlLabel-label') || item;
    const label = cleanChoiceLabel(labelNode?.textContent || '');
    if (!label) {
      return;
    }
    const span = document.createElement('span');
    span.className = `print-choice${checked ? ' selected' : ''}`;
    const mark = document.createElement('span');
    mark.className = 'mark';
    mark.textContent = radio ? (checked ? '●' : '○') : checked ? '☑' : '☐';
    span.appendChild(mark);
    span.appendChild(document.createTextNode(` ${label}`));
    wrapper.appendChild(span);
  });
  return wrapper;
};

/** Replace MUI radios/checkboxes with print-safe ○/● (or ☐/☑) text so PDF print is readable. */
const normalizeChoicesForPrint = (root) => {
  root.querySelectorAll('.MuiRadioGroup-root').forEach((group) => {
    const items = Array.from(group.querySelectorAll('.MuiFormControlLabel-root'));
    if (!items.length) {
      return;
    }
    const replacement = buildPrintChoiceGroup(items, { radio: true });
    if (replacement.childNodes.length) {
      group.replaceWith(replacement);
    }
  });

  // Any remaining standalone radio/checkbox labels (not already replaced)
  root.querySelectorAll('.MuiFormControlLabel-root').forEach((item) => {
    const hasRadio = !!item.querySelector('.MuiRadio-root, input[type="radio"]');
    const hasCheckbox = !!item.querySelector('.MuiCheckbox-root, input[type="checkbox"]');
    if (!hasRadio && !hasCheckbox) {
      return;
    }
    const replacement = buildPrintChoiceGroup([item], { radio: hasRadio && !hasCheckbox });
    if (replacement.childNodes.length) {
      item.replaceWith(replacement.firstChild);
    }
  });
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const waitForImages = (doc) => {
  const images = Array.from(doc.images || []);
  return Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
};

const collectDocuments = (root) => {
  const nodes = root.querySelectorAll('[data-app-doc-id]');
  const seen = new Set();
  const docs = [];
  nodes.forEach((node) => {
    const id = node.getAttribute('data-app-doc-id');
    if (!id || seen.has(id)) {
      return;
    }
    seen.add(id);
    docs.push({
      appDocId: id,
      documentTitle: node.getAttribute('data-doc-title') || id,
    });
  });
  return docs;
};

const renderPdfPages = async (blob) => {
  const data = await blob.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    pages.push(canvas.toDataURL('image/jpeg', 0.92));
  }
  return pages;
};

const buildAttachmentHtml = async (docs, fetchFile) => {
  if (!docs.length) {
    return '<p class="note">No attached documents found on this application.</p>';
  }

  const parts = [];
  for (const doc of docs) {
    const title = escapeHtml(doc.documentTitle);
    parts.push(`<div class="doc-block"><h3>${title}</h3>`);
    try {
      const response = await fetchFile(doc.appDocId);
      const contentType = (response.headers?.['content-type'] || response.data?.type || '').split(';')[0].trim();
      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: contentType || 'application/octet-stream' });
      const type = (blob.type || contentType || '').toLowerCase();

      if (type.startsWith('image/')) {
        const dataUrl = await blobToDataUrl(blob);
        parts.push(`<div class="doc-page"><img src="${dataUrl}" alt="${title}" /></div>`);
      } else if (type === 'application/pdf' || type.includes('pdf')) {
        const pages = await renderPdfPages(blob);
        if (!pages.length) {
          parts.push('<p class="note">PDF had no printable pages.</p>');
        } else {
          pages.forEach((src, index) => {
            parts.push(
              `<div class="doc-page"><div class="note">Page ${index + 1} of ${pages.length}</div><img src="${src}" alt="${title} page ${index + 1}" /></div>`
            );
          });
        }
      } else {
        parts.push(
          `<p class="note">File type "${escapeHtml(type || 'unknown')}" could not be embedded in print. Download it from the portal if needed.</p>`
        );
      }
    } catch (error) {
      console.error('Failed to include attachment in print:', doc, error);
      parts.push('<p class="error">Could not load this attachment for printing.</p>');
    }
    parts.push('</div>');
  }
  return parts.join('');
};

/**
 * Print the application preview dialog content via the browser print dialog.
 * @param {object} options
 * @param {HTMLElement|null|undefined} options.contentElement dialog content root
 * @param {(appDocId: string) => Promise<any>} options.fetchFile viewFile API
 * @param {string} [options.userName]
 * @param {string} [options.title]
 */
const printApplicationPreview = async ({
  contentElement,
  fetchFile,
  userName = '',
  title = 'Application Form Preview',
} = {}) => {
  if (!contentElement) {
    throw new Error('Preview content is not available yet.');
  }

  const printRoot =
    contentElement.querySelector('[data-print-root="application-preview"]') || contentElement;

  const loadingText = (printRoot.textContent || '').trim().toLowerCase();
  if (!loadingText || loadingText === 'no data available') {
    throw new Error('Application details are still loading or unavailable.');
  }

  const clone = printRoot.cloneNode(true);
  clone.querySelectorAll('[data-print-hide]').forEach((el) => el.remove());
  normalizeChoicesForPrint(clone);

  const docs = collectDocuments(printRoot);
  const attachmentsHtml = await buildAttachmentHtml(docs, fetchFile);
  const subtitle = userName ? `<div class="meta">Applicant: ${escapeHtml(userName)}</div>` : '';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>${PRINT_STYLES}</style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${subtitle}
  <h2>Application Details</h2>
  <div class="fields">${clone.innerHTML}</div>
  <h2>Attached Documents</h2>
  ${attachmentsHtml}
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('title', 'application-print-frame');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const iframeWindow = iframe.contentWindow;
  const iframeDocument = iframeWindow.document;
  iframeDocument.open();
  iframeDocument.write(html);
  iframeDocument.close();

  await waitForImages(iframeDocument);
  await new Promise((resolve) => setTimeout(resolve, 250));

  const cleanup = () => {
    try {
      document.body.removeChild(iframe);
    } catch (e) {
      // ignore
    }
  };

  iframeWindow.focus();
  iframeWindow.onafterprint = cleanup;
  try {
    iframeWindow.print();
  } catch (error) {
    cleanup();
    throw error;
  }
  setTimeout(cleanup, 60_000);
};

export default printApplicationPreview;
