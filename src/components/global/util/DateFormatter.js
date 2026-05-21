
const dateFormatter = (strTimestamp) => {

    const date = new Date(strTimestamp);
    
    // Array of month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Extract date components
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Format hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    
    return formattedDate;
    

}



export default dateFormatter;