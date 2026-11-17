export const hasLicenseAction = (allowedActions, action) =>
    Array.isArray(allowedActions) && allowedActions.includes(action);

/** Admin fills license details after bank-guarantee proof, or when CCA sends the form back. */
export const isAdminLicenseDetailsStatus = (status) => {
    const normalized = String(status || '')
        .replace(/%20/gi, '')
        .replace(/[\s_-]+/g, '')
        .toLowerCase();
    return normalized === 'bankguaranteeproofuploaded'
        || normalized === 'licensedetailssenttoadmin';
};

export const normalizeApplicationStatus = (status) =>
    (status || '').replace(/\s+/g, '').toLowerCase();

export const canSelectAuditAgency = (status) =>
    normalizeApplicationStatus(status) ===
    normalizeApplicationStatus('RECOMANDED_FOR_AUDIT');

export const pickLicenseAction = (allowedActions, priorityList = []) => {
    if (!Array.isArray(allowedActions)) {
        return null;
    }
    return priorityList.find((action) => allowedActions.includes(action)) || null;
};
