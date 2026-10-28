/**
 * Formats a date for form fields. Empty / unset / epoch (1970-01-01) values
 * from the API are treated as blank so auditors don't see a fake default date.
 */
const stringToDateFormat = (strTimestamp, format) => {
    if (
        strTimestamp === null ||
        strTimestamp === undefined ||
        strTimestamp === '' ||
        strTimestamp === 0 ||
        strTimestamp === '0'
    ) {
        return '';
    }

    const date = new Date(strTimestamp);

    if (isNaN(date.getTime())) {
        return '';
    }

    // Unfilled DB dates often serialize as Unix epoch
    if (date.getUTCFullYear() <= 1970 && date.getUTCMonth() === 0 && date.getUTCDate() <= 1) {
        return '';
    }
    if (date.getFullYear() <= 1970 && date.getMonth() === 0 && date.getDate() <= 1) {
        return '';
    }

    const pad = (num) => num.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    switch (format) {
        case "dd-MM-yyyy":
            return `${day}-${month}-${year}`;
        case "yyyy/MM/dd":
            return `${year}/${month}/${day}`;
        case "MM-dd-yyyy":
            return `${month}-${day}-${year}`;
        case "yyyy-MM-dd":
            return `${year}-${month}-${day}`;
        case "dd/MM/yyyy":
            return `${day}/${month}/${year}`;
        case "MM/dd/yyyy":
            return `${month}/${day}/${year}`;
        default:
            return "Unsupported Format";
    }
};

export default stringToDateFormat;