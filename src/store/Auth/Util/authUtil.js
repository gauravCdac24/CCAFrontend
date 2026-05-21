export const loadAuthState = () =>{

    try{
        const authState = localStorage.getItem('authState');

        if(authState === null){
            return undefined;
        }

        return JSON.parse(authState);
    } catch (error) {
        console.error("Could not load state ", error);
        return undefined;
    }



};

export const saveAuthState = (state) =>{
 
    try {
        const authState = JSON.stringify(state);
        localStorage.setItem('authState', authState);
        return true;
    } catch (error){
        console.error("Could not save state", error);
        return false;
    }
    
}