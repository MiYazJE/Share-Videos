import React from 'react';
import './modal.scss';

const Modal = ({ open, children, onClose }) => {

    return (
        <div className={`wrapModal ${open ? 'open' : 'close'}`}>
            <div className="wrapContent">
                <div className="closeWindow" onClick={onClose}>X</div>
                {children}
            </div>
        </div>
    )
}

export default Modal;