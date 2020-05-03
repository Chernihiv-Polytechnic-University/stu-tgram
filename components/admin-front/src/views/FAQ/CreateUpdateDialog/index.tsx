import React, { useState } from 'react'
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { InfoAttributes } from 'libs/domain-model'
import CustomDialog from '../../../components/CustomDialog'

export type HandleSubmit = {
  (data: InfoAttributes): any
}

export type CreateUpdateDialogProps = {
  mode: 'off' | 'create' | 'update'
  question: InfoAttributes
  handleClose: Function
  handleSubmit: HandleSubmit
  categories: string[]
}

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = (props) => {
  const { mode, handleClose, handleSubmit, categories, question: initialValue } = props

  const [lastMode, setLastMode] = useState<string>(mode)
  const [question, setQuestion] = useState<InfoAttributes>(initialValue)

  if (mode !== lastMode) {
    setQuestion(initialValue)
    setLastMode(mode)
    return null
  }

  const handleInputChange: any = (key: string) => (event: React.ChangeEvent<{ value: string}>) => {
    setQuestion({ ...question, [key]: event.target.value })
  }

  const handleCategoryChange: any = (_: any, value: string) => {
    setQuestion({ ...question, ['category']: value })
  }

  return (
    <CustomDialog
      isOpen={mode !== 'off'}
      handleClose={handleClose}
      disable={false}
      title={mode === 'create' ? 'Додати питання' : 'Редагувати питання'}
      buttonName={mode === 'create' ? 'Додати питання' : 'Редагувати'}
      handleSubmit={() => handleSubmit(question)}>
      <TextField
        value={question.question}
        onChange={handleInputChange('question')}
        variant='outlined'
        label='Введіть питання'
        fullWidth/>
      <Autocomplete
        value={question.category}
        onChange={handleCategoryChange}
        filterOptions={(options: string[], params) => {
          if (params.inputValue === '') { return options }
          return [params.inputValue].concat(options.filter(option => option?.includes(params.inputValue)))
        }}
        options={categories}
        getOptionLabel={option => option}
        renderInput={params => (
          <TextField {...params} label="Оберіть категорію" variant="outlined" fullWidth />
        )}/>
      <TextField
        onChange={handleInputChange('answer')}
        value={question.answer}
        label='Введіть відповідь'
        fullWidth
        multiline
        variant='outlined'/>
    </CustomDialog>
  )
}

export default CreateUpdateDialog
