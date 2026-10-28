import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SubMenuMasterService from '../../service/AdminService/SubMenuMasterService';
import { decrypt } from '../../components/global/util/EncryptDecrypt';
import LoaderProgress from '../../components/global/common/LoaderProgress';
import showAlert from '../../components/global/common/MessageBox/AlertService';
import { clearCredentials } from '../../store/Auth/Reducer';
import  store  from '../../store'; 

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [isValidRoute, setValidRoute] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const user = useSelector((state) => state.jwtAuthentication);
    const location = useLocation();
    const navigate = useNavigate(); 
    const pathname = location.pathname;
    const alertPath = useRef(null);

    const { id } = useParams();

    const redirectToLogin = () => {
        store.dispatch(clearCredentials());
        window.location.replace('/login');
    };

    const isRouteValid = async (roleName, path) => {
        try {
            const response = await SubMenuMasterService.getRoutesByRole(roleName, path);
            const isValid = decrypt(response.data) === "true";
            setSessionExpired(false);
            setValidRoute(isValid);
        } catch (err) {
            const status = err?.response?.status;
            setSessionExpired(!status || status === 401 || status === 403);
            setValidRoute(false); 
        }
    };

    useEffect(() => {
        setValidRoute(null);
        if (user?.roles?.length && user.currentRole) {
            const roleName = user.currentRole.substring(5);
            let path = pathname;
            if (id) {
                // React Router usually gives a decoded :id, while location.pathname
                // may still contain either the encoded or decoded form.
                const encodedId = encodeURIComponent(id);
                if (pathname.includes('/' + encodedId)) {
                    path = pathname.replace('/' + encodedId, '');
                } else if (pathname.includes('/' + id)) {
                    path = pathname.replace('/' + id, '');
                } else {
                    // Fallback: drop the last path segment for parameterized routes.
                    path = pathname.replace(/\/[^/]+$/, '');
                }
            }
            isRouteValid(roleName, path);
        } else {
            setSessionExpired(!user || user.username === '');
            setValidRoute(false);
        }
    }, [user, pathname]);

    useEffect(() => {
        if (isValidRoute !== false) {
            return;
        }
        if (!user || user.username === '') {
            return;
        }
        if (alertPath.current === pathname) {
            return;
        }
        alertPath.current = pathname;

        const expired = sessionExpired;
        showAlert({
            messageTitle: 'Unauthorized',
            messageContent: expired
                ? 'Your session has expired. Please login again to continue.'
                : 'Unauthorized access! You will be redirected to the home page.',
            confirmText: 'Ok',
            onConfirm: () => {
                if (expired) {
                    redirectToLogin();
                    return;
                }
                const homePage = store.getState().jwtAuthentication.homePath;
                if (homePage) {
                    navigate(homePage, { replace: true, state: { from: location } });
                } else {
                    redirectToLogin();
                }
            },
            enableHeaderCloseBtn: false,
            disableOutsideKeyDown: true,
        });
    }, [isValidRoute, sessionExpired, pathname]);

    if (isValidRoute === null) {
        return <LoaderProgress open />;
    }

    if (!user || user.username === '') {
        return <Navigate to="/login" replace state={{ from: location }} />; 
    }

    if (!isValidRoute) {
        return <LoaderProgress open />;
    }

    return <Component {...rest} />;
};

export default PrivateRoute;