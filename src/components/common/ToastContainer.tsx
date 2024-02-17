import React from 'react';
import { useRecoilValue } from 'recoil';
import { toastState } from '@/recoil/toastState';
import ToastBar from './ToastBar';
import { useToast } from '@/hooks/useToast';




const ToastContainer: React.FC = () => {

    const toasts = useRecoilValue(toastState);

    const { removeToast } = useToast();

    return (
        <div className='toast-container'>
            {toasts.map((toast) => (
                <ToastBar key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    )
}

export default ToastContainer;