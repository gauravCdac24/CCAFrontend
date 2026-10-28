import { decrypt } from './EncryptDecrypt';

let currentAuditScheduleId = null;

export const parseAnnualAuditRouteId = (encryptedId) => {
    const routeId = encryptedId ? decrypt(encryptedId) : '';
    const routeParts = routeId ? routeId.split(',') : [];
    return {
        userName: routeParts[0] || routeId || '',
        auditScheduleId: routeParts[1] || '',
    };
};

export const setAnnualAuditScheduleId = (auditScheduleId) => {
    currentAuditScheduleId = auditScheduleId || null;
};

export const getAnnualAuditScheduleId = () => currentAuditScheduleId;

export const clearAnnualAuditScheduleId = () => {
    currentAuditScheduleId = null;
};
