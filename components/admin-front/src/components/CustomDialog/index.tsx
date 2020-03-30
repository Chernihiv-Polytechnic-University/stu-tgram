import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core'

export interface CustomDialogProps {
    isOpen: boolean;
    children: React.ReactNode;
    handleClose: any;
    title: string;
    buttonName: string;
    handleSubmit: any;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
                                                       isOpen,
                                                       children,
                                                       handleClose, title,
                                                       handleSubmit,
                                                       buttonName}: CustomDialogProps) => {
    return (<div>
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Скасувати</Button>
                <Button onClick={handleSubmit}>{buttonName}</Button>
            </DialogActions>
        </Dialog>
    </div>)
}

export default CustomDialog