import React from 'react'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export type ErrorSnackbarProps = {
  title: string
  handleClose: any
  error: boolean
}

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = (props) => {
  const { title, handleClose, error } = props

  return (
    <Snackbar
      open={error}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} elevation={6} variant="filled" severity="error">
        {title}
      </Alert>
    </Snackbar>
  )
}

export default ErrorSnackbar