
import { toast, Slide } from 'react-toastify';

const BASE = {
    position: 'bottom-center',
    autoClose: 3000, 
    hideProgressBar: true,
    closeOnClick: false, 
    pauseOnHover: true,
    draggable: false,
    closeButton: false,
    transition: Slide,
    bodyClassName: 'font-medium',
};

export const toastSuccess = (msg, opts = {}) =>
    toast.success(msg, { ...BASE, ...opts });

export const toastError = (msg, opts = {}) =>
    toast.error(msg, { ...BASE, ...opts });

export const toastInfo = (msg, opts = {}) =>
    toast.info(msg, { ...BASE, ...opts });

export const toastWarn = (msg, opts = {}) =>
    toast.warn(msg, { ...BASE, ...opts });

export const showToast = {
    success: toastSuccess,
    error: toastError,
    info: toastInfo,
    warn: toastWarn,
};
