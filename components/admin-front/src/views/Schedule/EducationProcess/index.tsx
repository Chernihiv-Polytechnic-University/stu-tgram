import React, {useContext, useState} from 'react'
import FileUploader from '../../../components/FileUploader'
import { AppContext } from '../../../shared/reducer'
import Information from '../../../components/Information'

const EducationProcess: React.FC = () => {

  const { client } = useContext(AppContext)
  const [isGenerating, setGenerating] = useState<boolean>(false)
  const [isSuccess, setSuccess] = useState<boolean>(false)
  const [isGeneratingFinished, setGeneratingFinished] = useState<boolean>(false)

  const onFileUpload = async (file: any) => {
    setGeneratingFinished(false)
    setSuccess(false)
    setGenerating(true)
    await client.uploadEducationProcessSchedule({ file })
      .then((result: any) => {
        setGeneratingFinished(true)
        setGenerating(false)
        if (result.isSuccess) {
          setSuccess(true)
        }
      })
  }

  const resetSettings = () => {
    setGeneratingFinished(false)
    setSuccess(false)
    setGenerating(false)
  }

  console.log(isGeneratingFinished, isSuccess)

  return (
    <div>
      <Information>
        Інтерфейс відповідає за парсинг розкладу навчального процесу з xlsx документу<br />
        У кінці документу має бути опис усіх наявних в ньому легенд<br />
        Для того щоб змінити формат з xls, потрібно завантажити xls документ в Google Documents<br />
        а потім скачати його як xlsx<br />
      </Information>
      <FileUploader
        resetSettings={resetSettings}
        onFileUpload={onFileUpload}
        isGenerating={isGenerating}
        isGeneratingFinished={isGeneratingFinished}
        isSuccess={isSuccess}/>
    </div>
  )
}

export default EducationProcess
