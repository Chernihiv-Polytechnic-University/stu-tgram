import React, { useState } from 'react'
import { Button, Container, Grid, Typography } from '@material-ui/core'

export type Params = {
  onFileUpload: (file: any) => void
}

const FileUploader: React.FC<Params> = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState<any>(null)

  const onFileChange = (event: any) => {

    // Update the state
    setSelectedFile(event.target.files[0])

  }

  // TODO check file extension, only xlsx allowed
  // TODO styles
  // TODO disable upload button if there is no a file
  // TODO spiner
  // TODO hint
  return (
    <Container>
      <Grid container direction='row' justify='space-between' alignItems='baseline'>
        <Typography component="h3" variant="h3" align="center" color="textPrimary">Завантаження</Typography>
      </Grid>
      <input style={{ width: 600, height: 300, border: 'grey solid' }} type="file" onChange={onFileChange} />
      <Button onClick={() => onFileUpload(selectedFile)}>
        Upload!
      </Button>
    </Container>
  )
}

export default FileUploader
