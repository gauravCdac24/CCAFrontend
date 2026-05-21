import React from 'react';
import { createRoot } from 'react-dom/client';


const alertRoot = document.getElementById('alert-root') || (() => {
    const root = document.createElement('div');
    root.id = 'alert-root';
    document.body.appendChild(root);
    return root;
})();

const CallComponent = ({component}) => {

    const div = document.createElement('div');
    alertRoot.appendChild(div);
    const root = createRoot(div);

    root.render(
        <>
            {component}
        </>
    );
};

export default CallComponent;