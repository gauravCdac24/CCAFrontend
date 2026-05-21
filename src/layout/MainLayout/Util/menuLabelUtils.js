/**
 * Corrects known menu label typos for display (source data may still be in DB).
 */
export const formatMenuDisplayLabel = (label) => {
    if (!label || typeof label !== 'string') {
        return label;
    }
    return label.replace(/dashobard/gi, 'Dashboard');
};
