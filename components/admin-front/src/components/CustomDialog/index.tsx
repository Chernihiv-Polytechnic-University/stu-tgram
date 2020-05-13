import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@material-ui/core'

export interface CustomDialogProps {
  isOpen: boolean
  children: React.ReactNode
  handleClose?: any
  title: string
  buttonName: string
  closeButtonName?: string
  handleSubmit: any
  disable: boolean

}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  children,
  handleClose,
  title,
  handleSubmit,
  buttonName,
  closeButtonName = 'Скасувати',
  disable
}: CustomDialogProps
) => {
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
          {handleClose && <Button onClick={handleClose} variant='outlined' color='primary'>{closeButtonName}</Button>}
          <Button onClick={handleSubmit} variant='contained' color='primary' disabled={disable}>{buttonName}</Button>
        </Grid>
      </DialogActions>
    </Dialog>
  </div>)
}

export default CustomDialog
