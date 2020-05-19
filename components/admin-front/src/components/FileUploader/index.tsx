import React, { useState } from 'react'
import { Button, Container, makeStyles, Typography, CircularProgress } from '@material-ui/core'
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone'
import styles from './styles'
import FileUploaderContent from './FileUploaderContent'

export type FileUploaderProps = {
  onFileUpload: (file: any) => void
  isGenerating: boolean
  isSuccess: boolean
  isGeneratingFinished: boolean
  resetSettings: any
}

const useStyles = makeStyles(styles as any)

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, isGenerating, isSuccess, isGeneratingFinished, resetSettings }) => {
  const [isFileLoaded, setFileLoaded] = useState<boolean>(false)
  const [isFileRejected, setFileRejected] = useState<boolean>(false)
  const classes = useStyles()

  const { getRootProps, getInputProps, open, isDragAccept,
    isDragActive, isDragReject, acceptedFiles, fileRejections } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    onDrop<T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) {
      resetSettings()
      setFileRejected(false)
      setFileLoaded(false)
      if (acceptedFiles.length >= 1) {
        setFileLoaded(true)
        return
      }
      if (fileRejections.length >= 1) setFileRejected(true)
    }
  })

  if (acceptedFiles.length > 1) acceptedFiles.splice(1)

  let dragStyle: string
  isDragReject || isFileRejected ? dragStyle = classes.dragAndDropRejectStyle : dragStyle = classes.dragAndDropStyle
  if (isDragAccept) dragStyle = classes.dragAndDropAcceptStyle
  if (isFileLoaded) dragStyle = classes.dragAndDropSuccessLoaded
  if (!isSuccess && isGeneratingFinished) dragStyle = classes.dragAndDropRejectStyle


  return (
    <Container>
      <div {...getRootProps({ className: dragStyle })} >
        <input {...getInputProps()} />
        <FileUploaderContent
          isSuccess={isSuccess}
          isGenerating={isGenerating}
          isGeneratingFinished={isGeneratingFinished}
          fileName={acceptedFiles[0]?.name}
          isFileLoaded={isFileLoaded}
          isFileRejected={isFileRejected}
          isDragActive={isDragActive}
          isDragAccept={isDragAccept}
          isDragReject={isDragReject}/>
        {(isDragActive && isDragAccept) || isFileLoaded ? null : <div>
          <Button color='primary' variant='outlined' onClick={open}>
            Завантажити файл
          </Button>
          <Typography
            style={{ paddingTop: '16px' }}
            variant='h5' color='textPrimary'>Допускаються лише файли з розширенням .xlsx</Typography></div>}
        {!isSuccess  && isGeneratingFinished && !isDragActive ? <div>
          <Button color='primary' variant='outlined' onClick={open}>
            Завантажити файл
          </Button>
          <Typography
            style={{ paddingTop: '16px' }}
            variant='h5' color='textPrimary'>Допускаються </Typography></div> : null}
        {isFileLoaded && !isGeneratingFinished 
          ? ( isGenerating 
            ? <CircularProgress/> 
            : <Button color='primary' variant='outlined' onClick={() => onFileUpload(acceptedFiles[0])}>
          Генерувати
            </Button>) : null}
      </div>
    </Container>
  )
}

export default FileUploader
