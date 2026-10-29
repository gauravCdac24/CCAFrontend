/**
 * ApexCharts throws "Cannot read properties of null (reading 'hidden')"
 * when any entry in `series` is null. Counts from the API can be null,
 * and a graph series list can contain a null slot.
 */
export const sanitizeChartSeries = (series) => {
    if (!Array.isArray(series)) {
        return [];
    }

    const numeric = series.every((item) => item == null || typeof item === "number");
    if (numeric) {
        return series.map((item) =>
            typeof item === "number" && Number.isFinite(item) ? item : 0
        );
    }

    return series.filter((item) => item != null && typeof item === "object");
};

export const sanitizeCategories = (categories) =>
    Array.isArray(categories) ? categories : [];
