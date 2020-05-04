import React, { useState } from 'react'
import { TextField, makeStyles } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { InfoAttributes } from 'libs/domain-model'
import CustomDialog from '../../../components/CustomDialog'
import styles from './styles'

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

const useStyles = makeStyles(styles)

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = (props) => {
  const { mode, handleClose, handleSubmit, categories, question: initialValue } = props

  const [lastMode, setLastMode] = useState<string>(mode)
  const [question, setQuestion] = useState<InfoAttributes>(initialValue)

  const classes = useStyles()

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
        className={[classes.questionStyle, classes.marginStyle].join(' ')}
        value={question.question}
        onChange={handleInputChange('question')}
        variant='outlined'
        label='Введіть питання'
        fullWidth/>
      <Autocomplete
        className={[classes.autoCompleteStyle, classes.marginStyle].join(' ')}
        value={question.category}
        onChange={handleCategoryChange}
        filterOptions={(options: string[], params) => {
          if (params.inputValue === '') { return options }
          return [params.inputValue].concat(options.filter(option => option?.includes(params.inputValue)))
        }}
        options={categories}
        getOptionLabel={option => option}
        renderInput={params => (
          <TextField {...params} label="Оберіть або введіть категорію" variant="outlined" fullWidth />
        )}/>
      <TextField
        className={classes.marginStyle}
        onChange={handleInputChange('answer')}
        value={question.answer}
        rows={13}
        label='Введіть відповідь'
        fullWidth
        multiline
        variant='outlined'/>
    </CustomDialog>
  )
}

export default CreateUpdateDialog
