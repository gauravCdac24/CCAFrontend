
const dateFormatter = (strTimestamp) => {
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

    if (
        (date.getUTCFullYear() <= 1970 && date.getUTCMonth() === 0 && date.getUTCDate() <= 1) ||
        (date.getFullYear() <= 1970 && date.getMonth() === 0 && date.getDate() <= 1)
    ) {
        return '';
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}



export default dateFormatter;