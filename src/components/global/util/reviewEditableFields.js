import ApplicationReview from '../../../service/NewLicenseService/ApplicationReview';

/**
 * Maps Review Committee checkbox keys → applicant form field keys used by isFieldEnabled().
 */
export const REVIEW_TO_APPLICANT_FIELD_MAP = {
  ispWebsite: 'ispWebsiteAddress',
  ispUsername: 'ispUserName',
  panCardNo: 'incomeTaxPanNo',
  creditCardIssuedBy: 'issuedBy',
  personalWebPage: 'webPageURL',
  indivCapital: 'capital',
  draftNumber: 'bankDraft.draftNo',
  issueDate: 'bankDraft.issueDate',
  amount: 'bankDraft.amount',
  bankName: 'bankDraft.bankName',
  webURL: 'webPageURL',
  officeBlockNo: 'officialBlockNo',
  officeVillage: 'officialVillage',
  officePostOffice: 'officialPostOffice',
  officeSubDivision: 'officialSubDivision',
  officeCity: 'officialCity',
  officeState: 'officialState',
  officePin: 'officialPin',
  officeTelephoneNo: 'officialTelephoneNo',
  officeFax: 'officialFax',
  officeMobile: 'officialMobile',
  passportDocument: 'file1',
  panDocument: 'file3',
  panCardDocument: 'file3',
  capitalDocument: 'file4',
  idCardDocument: 'file2',
  individualCPSDocument: 'ind',
  voterIdDocument: 'file2',
};

const META_KEYS = new Set([
  'userName',
  'reviewerUserName',
  'isRejected',
  'isApproved',
  'reviewDate',
  'remarks',
  'reviewId',
  'intentAppId',
  'status',
  'file1', // MoM upload key on RC form, not passport file
]);

const isInactive = (status) => {
  if (status == null || status === '') return false;
  return String(status).toLowerCase() === 'inactive';
};

const addMappedKeys = (set, rawKey) => {
  if (rawKey == null || rawKey === '') return;
  const key = String(rawKey).trim();
  if (!key || META_KEYS.has(key)) return;
  // Ignore bare numeric document IDs — they are not applicant field names
  if (/^\d+$/.test(key)) return;

  set.add(key);
  const mapped = REVIEW_TO_APPLICANT_FIELD_MAP[key];
  if (mapped) set.add(mapped);
};

const collectFieldEntry = (set, field) => {
  if (field == null) return;
  if (typeof field === 'string') {
    addMappedKeys(set, field);
    return;
  }
  if (typeof field !== 'object') return;
  if (isInactive(field.status)) return;

  const name =
    field.fieldName ||
    field.name ||
    field.field ||
    field.key ||
    field.correctionField;

  if (name) addMappedKeys(set, name);
};

const collectFromReviewFields = (set, reviewFields = []) => {
  (Array.isArray(reviewFields) ? reviewFields : []).forEach((field) => {
    collectFieldEntry(set, field);
  });
};

const collectFromReviewDocuments = (set, reviewDocuments = []) => {
  (Array.isArray(reviewDocuments) ? reviewDocuments : []).forEach((doc) => {
    if (!doc || typeof doc !== 'object' || isInactive(doc.status)) return;
    const title =
      doc.documentTitle ||
      doc.documentName ||
      doc.fieldName ||
      doc.docTitle ||
      doc.name;
    if (title) addMappedKeys(set, title);
  });
};

const getLatestReview = (reviews) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return null;
  return [...reviews].sort((a, b) => {
    const idDiff = Number(b?.reviewId || 0) - Number(a?.reviewId || 0);
    if (idDiff) return idDiff;
    return new Date(b?.reviewDate || 0).getTime() - new Date(a?.reviewDate || 0).getTime();
  })[0];
};

const hasCorrectionEntries = (review) =>
  (Array.isArray(review?.reviewFields) && review.reviewFields.length > 0) ||
  (Array.isArray(review?.reviewDocuments) && review.reviewDocuments.length > 0);

const isNestedReviewList = (reviewData) =>
  Array.isArray(reviewData) &&
  reviewData.some(
    (item) =>
      item &&
      typeof item === 'object' &&
      (Array.isArray(item.reviewFields) || Array.isArray(item.reviewDocuments))
  );

/**
 * Ticked RC checkboxes are stored on the review as reviewFields / reviewDocuments.
 * Use the latest review that actually has correction entries (do not filter by isApproved —
 * some payloads keep isApproved false/true inconsistently during Edit_Upon_Review).
 */
const collectFromNestedReviews = (set, reviews) => {
  const reviewsWithFields = reviews.filter(hasCorrectionEntries);
  const latest = getLatestReview(reviewsWithFields);
  if (!latest) return;

  collectFromReviewFields(set, latest.reviewFields);
  collectFromReviewDocuments(set, latest.reviewDocuments);
};

/**
 * Flat list from get-all-application-review-by-username.
 * Only treat entries as corrections when the list is small/targeted OR status is explicitly Active
 * AND we did not already resolve nested correction fields.
 *
 * Important: do not treat a large "all fields Active" dump as corrections — that inverts enablement.
 */
const collectFromFlatCorrectionList = (set, list) => {
  const rows = Array.isArray(list) ? list : [];
  if (rows.length === 0) return;

  const withNames = rows
    .map((field) => {
      if (typeof field === 'string') return { name: field, status: 'Active' };
      if (!field || typeof field !== 'object') return null;
      const name =
        field.fieldName || field.name || field.field || field.key || field.correctionField;
      if (!name) return null;
      return { name, status: field.status };
    })
    .filter(Boolean);

  if (withNames.length === 0) return;

  // If almost every typical form field is present, this is not a correction list — ignore it
  if (withNames.length > 40) return;

  withNames.forEach(({ name, status }) => {
    if (isInactive(status)) return;
    // Accept Active or missing status as "marked for correction" on this endpoint
    if (status == null || status === '' || String(status).toLowerCase() === 'active') {
      addMappedKeys(set, name);
    }
  });
};

export const extractEditableFieldKeys = (reviewData) => {
  const editable = new Set();
  if (!reviewData) return editable;

  // Normalized fetch payload: { nested, flat, form6 }
  if (
    typeof reviewData === 'object' &&
    !Array.isArray(reviewData) &&
    (Object.prototype.hasOwnProperty.call(reviewData, 'nested') ||
      Object.prototype.hasOwnProperty.call(reviewData, 'flat') ||
      Object.prototype.hasOwnProperty.call(reviewData, 'form6'))
  ) {
    // 1) Primary: nested review history (same source RC uses to show past ticks)
    if (isNestedReviewList(reviewData.nested)) {
      collectFromNestedReviews(editable, reviewData.nested);
    }

    // 2) form6 current reviewFields/documents (also used by RC IndividualViewData)
    if (editable.size === 0 && reviewData.form6 && typeof reviewData.form6 === 'object') {
      collectFromReviewFields(editable, reviewData.form6.reviewFields);
      collectFromReviewDocuments(editable, reviewData.form6.reviewDocuments);

      // Some payloads nest under reviewApplications[latest]
      const apps = reviewData.form6.reviewApplications;
      if (editable.size === 0 && Array.isArray(apps) && apps.length > 0) {
        const latestApp = getLatestReview(apps) || apps[apps.length - 1];
        collectFromReviewFields(editable, latestApp?.reviewFields);
        collectFromReviewDocuments(editable, latestApp?.reviewDocuments);
      }
    }

    // 3) Flat list only as fallback when nested/form6 produced nothing
    if (editable.size === 0) {
      collectFromFlatCorrectionList(editable, reviewData.flat);
    }

    return editable;
  }

  if (isNestedReviewList(reviewData)) {
    collectFromNestedReviews(editable, reviewData);
    return editable;
  }

  if (Array.isArray(reviewData)) {
    collectFromFlatCorrectionList(editable, reviewData);
    return editable;
  }

  if (typeof reviewData === 'object') {
    collectFromReviewFields(editable, reviewData.reviewFields);
    collectFromReviewDocuments(editable, reviewData.reviewDocuments);
  }

  return editable;
};

export const fetchApplicationReviewDataForEdit = (userName) =>
  Promise.all([
    ApplicationReview.getAllApplicationReviewByUserNames(userName).catch(() => ({ data: [] })),
    ApplicationReview.getAllApplicationReviewByUserName(userName).catch(() => ({ data: [] })),
    ApplicationReview.getApplicationForm6ByUsername(userName).catch(() => ({ data: null })),
  ]).then(([nestedRes, flatRes, form6Res]) => {
    const nested = Array.isArray(nestedRes?.data) ? nestedRes.data : [];

    let flat = flatRes?.data;
    if (flat && !Array.isArray(flat) && Array.isArray(flat.reviewFields)) {
      flat = flat.reviewFields;
    } else if (flat && !Array.isArray(flat) && Array.isArray(flat.data)) {
      flat = flat.data;
    } else if (!Array.isArray(flat)) {
      flat = [];
    }

    const form6 = form6Res?.data && typeof form6Res.data === 'object' ? form6Res.data : null;

    return { nested, flat, form6 };
  });

/**
 * First-time fill (no correction fields resolved): all fields editable.
 * After review corrections: only ticked/marked fields are editable.
 */
export const isReviewFieldEnabled = (reviewData, fieldName) => {
  if (!fieldName) return false;
  const editableKeys = extractEditableFieldKeys(reviewData);

  if (editableKeys.size === 0) {
    return true;
  }

  if (editableKeys.has(fieldName)) {
    return true;
  }

  for (const [rcKey, applicantKey] of Object.entries(REVIEW_TO_APPLICANT_FIELD_MAP)) {
    if (applicantKey === fieldName && editableKeys.has(rcKey)) {
      return true;
    }
  }

  return false;
};
