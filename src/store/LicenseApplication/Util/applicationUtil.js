export const loadApplicationDetails = () =>{

    try{
        const currentApplication = localStorage.getItem('applicationDetails');

        if(currentApplication === null){
            return undefined;
        }

        return JSON.parse(currentApplication);
    } catch (error) {
        console.error("Could not load state ", error);
        return undefined;
    }



};

export const saveApplicationDetails = (state) =>{
 
    try {
        const currentApplication = JSON.stringify(state);
        localStorage.setItem('applicationDetails', currentApplication);
        return true;
    } catch (error){
        console.error("Could not save state", error);
        return false;
    }
    
}