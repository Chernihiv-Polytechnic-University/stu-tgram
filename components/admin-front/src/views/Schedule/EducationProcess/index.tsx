import React, { useContext } from 'react'
import FileUploader from '../../../components/FileUploader'
import { AppContext } from '../../../shared/reducer'

const EducationProcess: React.FC = () => {

  const { client } = useContext(AppContext)

  const onFileUpload = async (file: any) => {
    const { isSuccess } = await client.uploadEducationProcessSchedule({ file })
    if (!isSuccess) {
      // TODO
    }
  }

  return (
    <div>
      <p>Learning process Page</p>
      <FileUploader onFileUpload={onFileUpload}/>
    </div>
  )
}

export default EducationProcess
