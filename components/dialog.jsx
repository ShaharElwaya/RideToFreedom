// CustomizedDialogs.jsx

import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function CustomizedDialogs({ title, text, closeText, open, onClose }) {
    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={onClose}
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>{text}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={onClose}>
                        {closeText}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}
