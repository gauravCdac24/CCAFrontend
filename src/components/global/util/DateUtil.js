const stringToDateFormat = (strTimestamp, format) => {
    const date = new Date(strTimestamp);

    if (isNaN(date.getTime())) {
        return "Invalid Date";
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