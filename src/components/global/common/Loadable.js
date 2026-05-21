import { Suspense } from "react";
import Loader from "./Loader";

const Loadable = ({children}) =>(
    <Suspense fallback={<Loader />}>
        {children}
    </Suspense>
        
);

export default Loadable;

