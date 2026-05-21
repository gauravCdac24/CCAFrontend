import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SubMenuMasterService from '../../service/AdminService/SubMenuMasterService';
import { decrypt } from '../../components/global/util/EncryptDecrypt';
import LoaderProgress from '../../components/global/common/LoaderProgress';
import showAlert from '../../components/global/common/MessageBox/AlertService';
import  store  from '../../store'; 

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [isValidRoute, setValidRoute] = useState(null); 
    const user = useSelector((state) => state.jwtAuthentication);
    const location = useLocation();
    const navigate = useNavigate(); 
    const pathname = location.pathname;

    const { id } = useParams();

    const state = store.getState();
    const homePage = state.jwtAuthentication.homePath;


    const isRouteValid = async (roleName, path) => {
        try {
            const response = await SubMenuMasterService.getRoutesByRole(roleName, path);
            const isValid = decrypt(response.data) === "true";
            setValidRoute(isValid);
        } catch (err) {
            setValidRoute(false); 
        }
    };

    useEffect(() => {
        if (user?.roles?.length) {
            const roleName = user.currentRole.substring(5);
            let path = pathname;
            if (id) {
                path = pathname.replace('/' + encodeURIComponent(id), '');
            }
            isRouteValid(roleName, path);
        } else {
            setValidRoute(false);
        }
    }, [user, pathname]);

    const navigateToHomePage = () => {
        navigate(`${homePage}`, { state: { from: location } })
    }

    const showUnauthorizedAlert = () => {
        showAlert({
            messageTitle: 'Unauthorized',
            messageContent: 'Unauthorized access! You will be redirected to the home page.',
            confirmText: 'Ok',
            onConfirm: ()=>navigateToHomePage(),
            enableHeaderCloseBtn: false,
            disableOutsideKeyDown: true,
            closeParent: true
        });
    };

    if (isValidRoute === null) {
        return <LoaderProgress open />;
    }

    if (!user || user.username === '') {
        return <Navigate to="/login" state={{ from: location }} />; 
    }

    if (!isValidRoute) {
        showUnauthorizedAlert(); 
        return null; 
    }

    return <Component {...rest} />;
};

export default PrivateRoute;