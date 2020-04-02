import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from '@material-ui/core'

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
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Grid container direction='row' justify='space-between' alignItems='center'>
                    <Button onClick={handleClose} variant='outlined' color='primary'>Скасувати</Button>
                    <Button onClick={handleSubmit} variant='contained' color='primary'>{buttonName}</Button>
                </Grid>
            </DialogActions>
        </Dialog>
    </div>)
}

export default CustomDialog