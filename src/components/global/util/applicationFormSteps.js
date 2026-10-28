const FORM_STEP_NUMBERS = {
    personalDetails: { 1: 1 },
    addressDetails: { 1: 2 },
    financialDetails: { 1: 3, 4: 2 },
    firmDetails: { 2: 1, 3: 1 },
    incomeTaxDocumentDetails: { 2: 2, 3: 2 },
    partner: { 2: 3, 3: 3 },
    authorizedRepresentative: { 2: 4, 3: 4 },
    organizationalDetails: { 4: 1 },
    additionalDetails: { 1: 4, 2: 5, 3: 5, 4: 3 },
    location: { 1: 5, 2: 6, 3: 6, 4: 4 },
    cpsDocument: { 1: 6, 2: 7, 3: 7, 4: 5 },
    checklist: { 1: 7, 2: 8, 3: 8, 4: 6 },
    declaration: { 1: 8, 2: 9, 3: 9, 4: 7 },
};

const ORDINALS = {
    1: 'First',
    2: 'Second',
    3: 'Third',
    4: 'Fourth',
    5: 'Fifth',
    6: 'Sixth',
    7: 'Seventh',
    8: 'Eighth',
    9: 'Ninth',
};

const resolveAppType = (appTypeMasterId) => {
    const appType = Number(appTypeMasterId);
    return Number.isFinite(appType) && appType > 0 ? appType : 1;
};

export const getFormStepLabel = (appTypeMasterId, formKey) => {
    const appType = resolveAppType(appTypeMasterId);
    const stepNumber = FORM_STEP_NUMBERS[formKey]?.[appType]
        ?? FORM_STEP_NUMBERS[formKey]?.[1]
        ?? 1;
    return ORDINALS[stepNumber] || `${stepNumber}th`;
};

export const getStepSuccessAlert = (appTypeMasterId, formKey, isUpdate = false) => {
    const stepLabel = getFormStepLabel(appTypeMasterId, formKey);
    const action = isUpdate ? 'updated' : 'saved';
    return {
        messageTitle: `${stepLabel} Step Successful`,
        messageContent: `${stepLabel} step ${action} successfully.`,
    };
};

export const getStepErrorAlert = (appTypeMasterId, formKey, err) => {
    const stepLabel = getFormStepLabel(appTypeMasterId, formKey);
    const serverMessage = err?.response?.data;
    const detail = serverMessage && typeof serverMessage !== 'object'
        ? serverMessage
        : 'Your request cannot be processed at this time. Please try again later.';
    return {
        messageTitle: `${stepLabel} Step Error`,
        messageContent: `Failed to submit ${stepLabel.toLowerCase()} step. ${detail}`,
    };
};

export const getFinalSubmissionSuccessAlert = () => ({
    messageTitle: 'Application Submitted Successfully',
    messageContent: 'Your application form has been submitted successfully.',
});

export const getFinalSubmissionErrorAlert = (err) => {
    const serverMessage = err?.response?.data;
    const detail = serverMessage && typeof serverMessage !== 'object'
        ? serverMessage
        : 'Your request cannot be processed at this time. Please try again later.';
    return {
        messageTitle: 'Submission Error',
        messageContent: `Failed to submit application. ${detail}`,
    };
};
