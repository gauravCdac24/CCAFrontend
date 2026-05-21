// alertService.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import MessageBox from './MessageBox';
import { Provider as ReduxProvider } from 'react-redux';
import store from '../../../../store';
import MyTheme from '../../../../themes';


const alertRoot = document.getElementById('alert-root') || (() => {
    const root = document.createElement('div');
    root.id = 'alert-root';
    document.body.appendChild(root);
    return root;
})();

const showAlert = ({ closeParent = false, 
                     messageTitle, 
                     messageContent, 
                     confirmText = '', 
                     closeText = '', 
                     onConfirm, 
                     onClose, 
                     buttonOneText = '', 
                     onButtonOneClick, 
                     buttonTwoText = '', 
                     onButtonTwoClick, 
                     enableHeaderCloseBtn = false, 
                     disableOutsideKeyDown = false, 
                     fullWidth = false, 
                     maxWidth = "", 
                     buttonOneColor = '', 
                     buttonTwoColor = '', 
                     showHeader = true, 
                     showFooter = true,
                     showFooterBackgroundColor = true,
                     centerFooterContent = false,
                     divider = true,
                     removeDialogPadding = false }) => {


    const div = document.createElement('div');
    alertRoot.appendChild(div);

    const root = createRoot(div);

    const handleButtonOne = () => {
        if(onButtonOneClick) onButtonOneClick()
    }

    const handleButtonTwo = () => {
        if(onButtonTwoClick) onButtonTwoClick()
    }

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        close();
    };

    const handleClose = () => {
        if (onClose) onClose();
        close();
    };

    const close = () => {
        root.unmount();

        if(closeParent){
            while(alertRoot.firstChild){
                alertRoot.removeChild(alertRoot.lastChild);
            }
        }else{
            alertRoot.removeChild(div);
        }
    };

    root.render(
        <ReduxProvider store={store}>
            <MyTheme>
                <MessageBox
                    open={true}
                    messageTitle={messageTitle}
                    messageContent={messageContent}
                    confirmText={confirmText}
                    closeText={closeText}
                    buttonOneText={buttonOneText}
                    buttonTwoText={buttonTwoText}
                    handleButtonOne={handleButtonOne}
                    handleButtonTwo={handleButtonTwo}
                    handleConfirm={handleConfirm}
                    handleClose={handleClose}
                    enableHeaderCloseBtn={enableHeaderCloseBtn}
                    disableOutsideKeyDown={disableOutsideKeyDown}
                    fullWidth={fullWidth}
                    maxWidth={maxWidth}
                    container={div}
                    buttonOneColor={buttonOneColor}
                    buttonTwoColor={buttonTwoColor}
                    showHeader={showHeader}
                    showFooter={showFooter}
                    showFooterBackgroundColor={showFooterBackgroundColor}
                    centerFooterContent={centerFooterContent}
                    divider={divider}
                    removeDialogPadding={removeDialogPadding}
                />
            </MyTheme>
        </ReduxProvider>
    );
};

export default showAlert;