import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Container,
  Grid,
  Typography,
  ThemeProvider,
  TextField,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import { map } from 'lodash'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import theme from '../../shared/theme'
import { InfoAttributes } from 'libs/domain-model'
import CustomDialog from '../../components/CustomDialog'
import deleteIcon from '../../assets/deleteIcon.svg'
import changeIcon from '../../assets/changeIcon.svg'
import { AppContext } from '../../shared/reducer'
import styles from './styles'
import { INITIAL_NEW_QUESTION, ITEMS_PER_PAGE } from './constants'

const filterOptions = createFilterOptions<string>()

const useStyles = makeStyles(styles as any)

const FAQ: React.FC = () => {
  const { client } = useContext(AppContext)
  const [questions, setQuestions] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [newQuestion, setQuestion] = useState<InfoAttributes>(INITIAL_NEW_QUESTION)
  const [deleteQuestionId, setDeleteQuestionId] = useState<string>('')
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
  const [isDialogDeleteOpen, setDialogDeleteOpen] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [query, setQuery] = useState<string>('')

  const classes = useStyles()

  const onMoreClick: any = () => {
    setPage(page + 1)
  }

  const fetchCategories: any = async () => {
    const { isSuccess, result } = await client.getInfoCategories(null)

    if (!isSuccess) { return }
    setCategories(map(result, 'category'))
  }

  const fetchQuestions: any = async () => {
    const { result, isSuccess } = await client.getManyInfo({ limit: ITEMS_PER_PAGE, page, question: query })

    if (!isSuccess) { return }

    if (page === 0) {
      setQuestions(result.docs)
    } else {
      setQuestions(old => [...old, ...result.docs])
    }
  }

  const handleDialogClose: any = () => {
    setDialogOpen(false)
    setQuestion(INITIAL_NEW_QUESTION)
  }

  const handleDialogOpen: any = () => {
    setDialogOpen(true)
  }

  const handleCreateQuestion: any = async () => {
    const { isSuccess } = await client.createInfo(newQuestion)
    if (!isSuccess) { return }

    setPage(0)
    setQuestion(INITIAL_NEW_QUESTION)

    handleDialogClose()
  }

  const handleDeleteDialogOpen: any = (id: string) => {
    setDialogDeleteOpen(true)
    setDeleteQuestionId(id)
  }

  const handleDeleteDialogClose: any = () => {
    setDialogDeleteOpen(false)
    setDeleteQuestionId('')
  }

  const handleDeleteQuestion: any = async () => {
    const { isSuccess } = await client.deleteInfo({ id: deleteQuestionId })

    if (!isSuccess) { return }

    if (page !== 0) {
      setPage(0)
    } else {
      fetchQuestions()
    }
    handleDeleteDialogClose()
  }

  const handleQueryChange: any = (event: React.ChangeEvent<{ value: string}>) => {
    setPage(0)
    setQuery(event.target.value)
  }

  const handleInputChange: any = (key: string) => (event: React.ChangeEvent<{ value: string}>) => {
    setQuestion({ ...newQuestion, [key]: event.target.value })
  }

  const handleCategoryChange: any = (_: any, value: string) => {
    setQuestion({ ...newQuestion, ['category']: value })
  }

  useEffect(() => {
    fetchCategories()
    fetchQuestions()
  }, [page, query])

  const deleteDialog =
        <CustomDialog
          isOpen={isDialogDeleteOpen}
          handleClose={handleDeleteDialogClose}
          title='Видалити питання?'
          buttonName='Так, видалити питання'
          handleSubmit={handleDeleteQuestion}
          disable={false}>
          <Typography>Ви впевнені, що хочете видалити питання?</Typography>
        </CustomDialog>

  const questionCreateDialog =
        <CustomDialog
          isOpen={isDialogOpen}
          handleClose={handleDialogClose}
          disable={false}
          title={'Додати питання'} buttonName={'Створити'} handleSubmit={handleCreateQuestion}>
          <TextField
            value={newQuestion.question}
            onChange={handleInputChange('question')}
            variant='outlined'
            label='Введіть питання'
            fullWidth/>
          <Autocomplete
            value={newQuestion.category}
            onChange={handleCategoryChange}
            filterOptions={(options, params) => {
              const filtered = filterOptions(options, params) as string[]
              if (params.inputValue !== '') {
                filtered.push(params.inputValue)
              }
              return filtered
            }}
            options={categories}
            getOptionLabel={option => option}
            renderInput={params => (
              <TextField {...params} label="Оберіть категорію" variant="outlined" fullWidth />
            )}/>
          <TextField
            onChange={handleInputChange('answer')}
            value={newQuestion.answer}
            label='Введіть відповідь'
            fullWidth
            multiline
            variant='outlined'/>
        </CustomDialog>

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container direction='row' justify='space-between' alignItems='baseline'>
          <Typography component="h3" variant="h3" align="left" color="textPrimary">Питання та відповіді</Typography>
          <Button
            onClick={handleDialogOpen}
            variant='outlined'
            color='primary'>Додати запитання
          </Button>
        </Grid>
        <Grid container direction='row' justify='flex-end'>
          <TextField classes={{ root: classes.searchTextField }} variant='outlined' label='Пошук...' onChange={handleQueryChange}/>
        </Grid>
        {questionCreateDialog}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Питання</TableCell>
              <TableCell>Категорія</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question, index) => {
              return (<TableRow key={question._id} hover>
                <TableCell>
                  {index+1}
                </TableCell>
                <TableCell>
                  {question.question}
                </TableCell>
                <TableCell>
                  <Button
                    classes={{
                      root: classes.category,
                      label: classes.label
                    }}
                    color="primary"
                    variant="outlined">{question.category}</Button>
                </TableCell>
                <TableCell>
                  <IconButton aria-label=''>
                    <img src={changeIcon} alt='Змінити'/>
                  </IconButton>
                  <IconButton aria-label='' onClick={() => handleDeleteDialogOpen(question._id)}>
                    <img src={deleteIcon} alt='Видалити'/>
                  </IconButton>
                </TableCell>
              </TableRow>)
            })}
          </TableBody>
        </Table>
        <Button onClick={onMoreClick}>Більше</Button>
        {deleteDialog}
      </Container>
    </ThemeProvider>
  )
}

export default FAQ
