import { Toast } from '@/recoil/toastState';
import React from 'react';

const iconStyles: { [key: string]: string } = {
    success: "text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200",
    danger: "text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200",
    warning: "text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200",
};


const ToastBar: React.FC<Toast> = ({ type, message, onClose = () => { }, id }) => {
    const handleClose = () =>
        onClose();
    const Icon = () => {
        switch (type) {
            case 'success':
                return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>;
            case 'danger':
                return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
            case 'warning':
                return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            default:
                return null;
        }
    };

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 mb-4 text-sm text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', zIndex: 1050 }} role="alert">
            <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${iconStyles[type]}`}>
                <Icon />
            </div>
            <div className="ml-3">{message}</div>
            <button onClick={handleClose} className="ml-auto -my-1.5 -mr-1.5 bg-transparent text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
                <span className="sr-only">Close</span>
            </button>
        </div>
    );
}

export default ToastBar;
