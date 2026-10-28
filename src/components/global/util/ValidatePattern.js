const ValidatePattern = (e, pattern) => {


    const updatedValue = e.target.value + e.key;
    if (e.key === 'Backspace') {
        return;
    }
    if (e.key === "Tab") {
        return; 
    }
    if (!new RegExp(pattern).test(updatedValue)) {
        e.preventDefault();
    }

}

export const isValidWebUrl = (value) => {
    const trimmed = (value || '').trim();
    if (!trimmed) {
        return false;
    }
    try {
        const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
        const url = new URL(normalized);
        return (url.protocol === 'http:' || url.protocol === 'https:')
            && url.hostname.includes('.');
    } catch {
        return false;
    }
};

export default ValidatePattern;