
export const timeStampToDate = (strTimestamp) => {
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

    // Unfilled DB dates often serialize as Unix epoch (shown as 01-Jan-1970)
    if (
        (date.getUTCFullYear() <= 1970 && date.getUTCMonth() === 0 && date.getUTCDate() <= 1) ||
        (date.getFullYear() <= 1970 && date.getMonth() === 0 && date.getDate() <= 1)
    ) {
        return '';
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}
