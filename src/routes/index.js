import {useRoutes} from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';





const ThemeRoutes = () =>{

    const privateRoutes = PrivateRoutes();

    return useRoutes([PublicRoutes, privateRoutes]);
}

export default ThemeRoutes;