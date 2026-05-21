import { lazy } from "react";
import MinimalLayout from '../layout/MinimalLayout'


const LoginPage = lazy(()=> import('../components/global/pages/Login'));
const EsignPage = lazy(()=> import('../components/global/pages/Esign'));
const ForgotPasswordPage = lazy(()=> import('../components/global/pages/forgotpwd/ForgotPassword'));
const IntentRegistration = lazy(()=> import('../components/global/pages/IntentRegistration'));
const PageNotFound = lazy(()=> import('../components/global/pages/PageNotFound'))
const EsignResponsePage = lazy(()=> import('../components/global/pages/EsignResponse'))

const PublicRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '',
            element: <LoginPage />
        },
        {
            path: 'login',
            element: <LoginPage />
        },
        {
            path: 'esign',
            element: <EsignPage />
        },
        {
            path: 'forgotpwd',
            element: <ForgotPasswordPage />
        },
        {
            path: 'esignresponse',
            element: <EsignResponsePage />
        },
        {
            path: 'intentregistration',
            element: <IntentRegistration />
        },
        {
            path: '*',
            element: <PageNotFound />
        }
        

    ]
}

export default PublicRoutes;