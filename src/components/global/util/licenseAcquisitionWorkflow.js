export const hasLicenseAction = (allowedActions, action) =>
    Array.isArray(allowedActions) && allowedActions.includes(action);

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
