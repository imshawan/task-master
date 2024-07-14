import React from 'react';
import { ToastContainer } from "react-toastify";


const Toast = () => {
    return (
        <ToastContainer
            autoClose={3000}
            position='top-right'
            closeOnClick={false}
            hideProgressBar={false}
            stacked={true}
        />
    );
};

export default Toast;
