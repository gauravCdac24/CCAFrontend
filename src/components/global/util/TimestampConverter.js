
export const timeStampToDate = (strTimestamp) => {

    const date = new Date(strTimestamp);
    
    // Array of month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Extract date components
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    const formattedDate = `${day}-${month}-${year}`;
    
    return formattedDate;
    

}
