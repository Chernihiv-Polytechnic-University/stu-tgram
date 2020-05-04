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
import { InfoAttributes } from 'libs/domain-model'
import CreateUpdateDialog, { HandleSubmit } from './CreateUpdateDialog'
import theme from '../../shared/theme'
import CustomDialog from '../../components/CustomDialog'
import deleteIcon from '../../assets/deleteIcon.svg'
import changeIcon from '../../assets/changeIcon.svg'
import { AppContext } from '../../shared/reducer'
import styles from './styles'
import { CREATE_UPDATE_DIALOG_DEFAULT_STATE, INITIAL_NEW_QUESTION, ITEMS_PER_PAGE } from './constants'


const useStyles = makeStyles(styles as any)

const FAQ: React.FC = () => {
  const { client } = useContext(AppContext)
  const [questions, setQuestions] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [deleteQuestionId, setDeleteQuestionId] = useState<string>('')
  const [createUpdateDialogState, setCreateUpdateDialogState] = useState(CREATE_UPDATE_DIALOG_DEFAULT_STATE)
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

  const refresh = () => {
    if (page !== 0) {
      setPage(0)
    } else {
      fetchQuestions()
    }
  }

  const handleCreateUpdateDialogClose: any = () => {
    setCreateUpdateDialogState(CREATE_UPDATE_DIALOG_DEFAULT_STATE)
  }

  const handleCreateUpdateDialogOpen: any = (initialValue: InfoAttributes = INITIAL_NEW_QUESTION, id?: string) => () => {
    setCreateUpdateDialogState({ mode: !id ? 'create' : 'update', updatingId: id, initialValue })
  }

  const handleCreateUpdateQuestion: HandleSubmit = async (data) => {
    const { mode, updatingId } = createUpdateDialogState
    let result

    if (mode === 'update' && updatingId) {
      result = await client.updateInfo({ ...data, id: updatingId })
    } else if (mode === 'create') {
      result = await client.createInfo(data)
    }

    if (!result.isSuccess) {
      return
    }

    refresh()
    handleCreateUpdateDialogClose()
  }

  const handleDeleteDialogOpen: any = (id: string) => () => {
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

    refresh()
    handleDeleteDialogClose()
  }

  const handleQueryChange: any = (event: React.ChangeEvent<{ value: string}>) => {
    setPage(0)
    setQuery(event.target.value)
  }

  useEffect(() => {
    fetchCategories()
    fetchQuestions()
  }, [page, query])

  const deleteDialog = (
    <CustomDialog
      isOpen={isDialogDeleteOpen}
      handleClose={handleDeleteDialogClose}
      title='Видалити питання?'
      buttonName='Так, видалити питання'
      handleSubmit={handleDeleteQuestion}
      disable={false}>
      <Typography align='center'>Ви впевнені, що хочете видалити питання?</Typography>
    </CustomDialog>
  )

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container direction='row' justify='space-between' alignItems='baseline'>
          <Typography component="h3" variant="h3" align="left" color="textPrimary">Питання та відповіді</Typography>
          <Button
            onClick={handleCreateUpdateDialogOpen()}
            variant='outlined'
            color='primary'
          >
            Додати запитання
          </Button>
        </Grid>
        <Grid container direction='row' justify='flex-end'>
          <TextField classes={{ root: classes.searchTextField }} variant='outlined' label='Пошук...' onChange={handleQueryChange}/>
        </Grid>
        <CreateUpdateDialog
          mode={createUpdateDialogState.mode}
          categories={categories}
          handleClose={handleCreateUpdateDialogClose}
          question={createUpdateDialogState.initialValue}
          handleSubmit={handleCreateUpdateQuestion}
        />
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
                  <IconButton aria-label='' onClick={handleCreateUpdateDialogOpen(question, question._id)}>
                    <img src={changeIcon} alt='Змінити'/>
                  </IconButton>
                  <IconButton aria-label='' onClick={handleDeleteDialogOpen(question._id)}>
                    <img src={deleteIcon} alt='Видалити'/>
                  </IconButton>
                </TableCell>
              </TableRow>)
            })}
          </TableBody>
        </Table>
        <Button classes={{ root: classes.moreButton }} onClick={onMoreClick}>... Показати більше</Button>
        {deleteDialog}
      </Container>
    </ThemeProvider>
  )
}

export default FAQ
