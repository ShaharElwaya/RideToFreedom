import React from 'react';
import { TextareaAutosize } from '@mui/material';
import { Margin } from '@mui/icons-material';

export default function TextAreaComponent({ placeholderText }) {
    const iconStyle = {
        height: '200px',
        width: '500px',
        resize: 'none',
        fontFamily: 'Heebo, sans-serif',
        margin: 0
    };

    return (
        <div>
            <TextareaAutosize
                style={iconStyle}
                placeholder={placeholderText}
            />
        </div>
    );
}