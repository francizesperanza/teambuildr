import { XMarkIcon } from '@heroicons/react/20/solid';
import { useState } from 'react'


function Modal({isOpen, onClose, children}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-99"
            onClick={onClose}>
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative z-100"
                 onClick={(e) => e.stopPropagation()}>
                <button
                    className="absolute top-[8%] right-[3%] text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <XMarkIcon className="h-5 w-5 inline" />
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal