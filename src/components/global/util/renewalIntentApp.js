let currentRenewalIntentAppId = null;

export const setRenewalIntentAppId = (intentAppId) => {
    currentRenewalIntentAppId = intentAppId || null;
};

export const getRenewalIntentAppId = () => currentRenewalIntentAppId;

export const clearRenewalIntentAppId = () => {
    currentRenewalIntentAppId = null;
};
