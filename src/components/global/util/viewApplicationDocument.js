/**
 * Helpers for "View" links on application document previews.
 */

const isActiveDocument = (status) =>
  String(status || '').trim().toLowerCase() === 'active';

/**
 * Section 35 shows one file per title. A later Active upload replaces an older
 * copy of the same title (the earlier copy was the audit report).
 * A title that was uploaded only once is kept even when it is inactive.
 * @param {Array} docs
 */
export const keepLatestDocumentPerTitle = (docs) => {
  if (!Array.isArray(docs)) {
    return [];
  }
  const ordered = docs
    .slice()
    .sort((a, b) => Number(a?.appDocId || 0) - Number(b?.appDocId || 0));
  const chosen = new Map();
  ordered.forEach((doc) => {
    const title = doc?.documentTitle || '';
    const current = chosen.get(title);
    if (!current) {
      chosen.set(title, doc);
      return;
    }
    const candidateActive = isActiveDocument(doc.status);
    const currentActive = isActiveDocument(current.status);
    if (candidateActive && !currentActive) {
      chosen.set(title, doc);
      return;
    }
    if (candidateActive === currentActive && Number(doc.appDocId || 0) > Number(current.appDocId || 0)) {
      chosen.set(title, doc);
    }
  });
  return Array.from(chosen.values());
};

/**
 * Pick the latest matching application document (Active preferred).
 * @param {Array} docs
 * @param {string|string[]} titles documentTitle value(s) to match
 */
export const getLatestApplicationDoc = (docs, titles) => {
  const titleList = (Array.isArray(titles) ? titles : [titles]).filter(Boolean);
  if (!Array.isArray(docs) || titleList.length === 0) {
    return null;
  }

  const normalizedTitles = titleList.map((title) => String(title).toLowerCase());
  const matched = docs.filter((doc) => {
    if (!doc?.appDocId) {
      return false;
    }
    const docTitle = String(doc?.documentTitle || '').toLowerCase();
    return normalizedTitles.includes(docTitle);
  });
  if (matched.length === 0) {
    return null;
  }

  const active = matched.filter(
    (doc) => !doc.status || String(doc.status).trim().toLowerCase() === 'active'
  );
  // Prefer Active; if none, keep latest matched (field gating hides unrelated leftovers).
  const pool = active.length > 0 ? active : matched;

  return pool
    .slice()
    .sort((a, b) => {
      const aTime = new Date(a.updateDate || a.updated || a.created || 0).getTime();
      const bTime = new Date(b.updateDate || b.updated || b.created || 0).getTime();
      return bTime - aTime;
    })[0];
};

/**
 * Open an application document in a new tab (download fallback).
 * @param {(id: string|number) => Promise<any>} fetchFile e.g. ApplicationForm.viewFile
 * @param {string|number} appDocId
 * @param {string} [documentTitle]
 * @param {Event} [event]
 */
export const openApplicationDocument = async (
  fetchFile,
  appDocId,
  documentTitle = 'document',
  event
) => {
  if (event) {
    event.preventDefault?.();
    event.stopPropagation?.();
  }

  if (!appDocId || typeof fetchFile !== 'function') {
    return;
  }

  const response = await fetchFile(appDocId);
  const headerType =
    response?.headers?.['content-type'] ||
    response?.headers?.['Content-Type'] ||
    '';
  const contentType =
    String(headerType).split(';')[0].trim() ||
    (response?.data instanceof Blob && response.data.type) ||
    'application/pdf';

  const blob =
    response?.data instanceof Blob
      ? response.data.type
        ? response.data
        : response.data.slice(0, response.data.size, contentType)
      : new Blob([response?.data], { type: contentType });

  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  const isPreviewable =
    contentType.includes('pdf') || contentType.startsWith('image/');
  if (!isPreviewable) {
    const safeName = String(documentTitle || 'document').replace(
      /[^\w.\-]+/g,
      '_'
    );
    link.download = safeName.includes('.') ? safeName : `${safeName}.pdf`;
  }

  window.document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 60000);
};
