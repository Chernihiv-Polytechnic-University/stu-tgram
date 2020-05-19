import React from 'react'
import { CircularProgress, Typography } from '@material-ui/core'

type FileUploaderContentProps = {
  isDragActive: boolean
  isDragAccept: boolean
  isDragReject: boolean
  isFileLoaded: boolean
  isFileRejected: boolean
  fileName: string
  isSuccess: boolean
  isGenerating: boolean
  isGeneratingFinished: boolean
}

const StartContent: React.FC = () => {
  return <div>
    <Typography
      style={{ lineHeight: '150%', paddingTop: '74px', paddingBottom: '16px' }}
      variant='h3'
      color='primary'>Перетягніть необхідний файл
    </Typography>
    <Typography style={{ paddingBottom: '16px' }} variant='h5' color='textPrimary'>або</Typography>
  </div>
}

const ActiveAndRejectContent: React.FC = () => {
  return <div>
    <Typography
      style={{ lineHeight: '150%', paddingTop: '74px', paddingBottom: '16px' }}
      variant='h3'
      color='primary'>Неможливо завантажити файл
    </Typography>
    <Typography style={{ paddingBottom: '16px' }} variant='h5' color='textPrimary'>Повторіть спробу. Оберіть файл з розширенням .xlsx</Typography>
  </div>
}

const ActiveAndAcceptContent: React.FC = () => {
  return <div>
    <Typography
      style={{ lineHeight: '150%', paddingTop: '74px', paddingBottom: '24px' }}
      variant='h3'
      color='primary'>Завантаження файла</Typography>
    <CircularProgress/>
    <Typography
      style={{ paddingBottom: '16px', paddingTop: '24px' }}
      variant='h5'
      color='textPrimary'>Зачекайте завантаження файла, а потім натисніть кнопку Згенерувати</Typography>
  </div>
}

const SuccessFileLoadedContent: React.FC<any> = (props) => {
  const { fileName } = props
  
  return <div>
    <Typography
      style={{ lineHeight: '150%', paddingTop: '74px', paddingBottom: '16px' }}
      variant='h3'
      color='primary'>Файл [{fileName}] успішно завантажено!
    </Typography>
    <Typography style={{ paddingBottom: '16px' }} variant='h5' color='textPrimary'>
      Для початку парсингу графіку навчального процесу натисніть кнопку</Typography>
  </div>
}

const SuccessGenerating: React.FC = () => {
  return <div>
    <Typography
      style={{ lineHeight: '150%', paddingTop: '74px', paddingBottom: '16px' }}
      variant='h3'
      color='primary'>Парсинг виконано успішно!
    </Typography>
    <Typography style={{ paddingBottom: '16px' }} variant='h5' color='textPrimary'>
      Ви можете перевірити коректність даних файлу у Telegram боті</Typography>
  </div>
}

const FailedGenerating: React.FC = () => {
  return <div>
    <Typography
      style={{ lineHeight: '150%', paddingTop: '74px', paddingBottom: '16px' }}
      variant='h3'
      color='primary'>Сталася помилка
    </Typography>
    <Typography style={{ paddingBottom: '16px' }} variant='h5' color='textPrimary'>Повторіть спробу. Перетягніть файл або натисніть кнопку</Typography>
  </div>
}

const FileUploaderContent: React.FC<FileUploaderContentProps> = (props) => {
  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    isFileLoaded,
    isFileRejected,
    fileName,
    isGeneratingFinished,
    isGenerating,
    isSuccess } = props

  if (isDragActive && isDragAccept) return <ActiveAndAcceptContent/>
  if (isFileLoaded && !isDragActive) {
    if (isGeneratingFinished) {
      if (isSuccess) {
        return <SuccessGenerating/>
      } else return <FailedGenerating/>
    }
    return <SuccessFileLoadedContent fileName={fileName}/>
  }
  if ((isDragActive && isDragReject) || isFileRejected) return <ActiveAndRejectContent/>


  return <StartContent/>
}

export default FileUploaderContent