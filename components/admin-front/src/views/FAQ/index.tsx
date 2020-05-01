import React, {useEffect, useState} from 'react'
import {
    Button,
    Container,
    Grid,
    Typography,
    ThemeProvider,
    TextField,
    TableHead,
    TableRow, TableCell, TableBody, Table, makeStyles, IconButton
} from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'
import theme from '../../theme'
import { InfoAttributes} from 'libs/domain-model'
import CustomDialog from '../../components/CustomDialog'
import {client} from '../../client'
import {uniq} from 'lodash'
import deleteIcon from '../../assets/deleteIcon.svg'
import changeIcon from '../../assets/changeIcon.svg'

const INITIAL_NEW_QUESTION: InfoAttributes = {
    question: '',
    answer: '',
    category: 'Category num 1'
}

const useStyles = makeStyles({
    category: {
        color: '#2282A1',
        border: '1px solid #2282A1',
        height: '35px',
        '&:hover': {
            border: '1px solid',
            cursor: 'default',
            backgroundColor: '#FFFFFF'
        }
    },
    label: {
        fontWeight: 'normal',
        textTransform: 'none'
    },
    searchTextField: {
        width: '378px',
        paddingBottom: '24px'
    }
})

const FAQ: React.FC = () => {
    const [questions, setQuestions] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [newQuestion, setQuestion] = useState<InfoAttributes>(INITIAL_NEW_QUESTION)
    const [deleteQuestionId, setDeleteQuestionId] = useState<string>('')
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
    const [isDialogDeleteOpen, setDialogDeleteOpen] = useState<boolean>(false)

    const classes = useStyles()

    const fetchQuestions: any = async () => {
        const { result } = await client.getManyInfo({}) as any
        if (result) {
            setQuestions(result.docs)
        }
    }

    // const fetchCategories: any = () => {
    //     setCategories(uniq(questions.map(item => {
    //         return item.category
    //     })))
    // }

    const handleDialogClose: any = () => {
        setDialogOpen(false)
        setQuestion(INITIAL_NEW_QUESTION)
    }

    const handleDialogOpen: any = () => {
        setDialogOpen(true)
    }

    const handleCreateQuestion: any = async () => {
        const { isSuccess } = await client.createInfo(newQuestion)
        if (isSuccess){
            setQuestions(prevUsers => prevUsers.concat(newQuestion))
            setQuestion(INITIAL_NEW_QUESTION)
        }
        handleDialogClose()
    }

    const deleteQuestionFromState: any = (id: string) => {
        setQuestions(prevState => prevState.filter(({ _id }) => _id !== id))
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
        const { isSuccess } = await client.deleteInfo({id: deleteQuestionId})
        if (isSuccess) {
            deleteQuestionFromState(deleteQuestionId)
        }
        handleDeleteDialogClose()
    }

    const handleInputChange: any = (event: React.ChangeEvent<{ value: string}>, key: string) => {
        setQuestion({...newQuestion, [key]: event.target.value})
    }


    useEffect(() => {
        fetchQuestions()
    }, [])


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
                    onChange={(e) => handleInputChange(e, 'question')}
                    variant='outlined'
                    label='Введіть питання'
                    fullWidth/>
                <Autocomplete
                    options={questions}
                    getOptionLabel={option => option.category}
                    renderInput={params => (
                        <TextField {...params} label="Оберіть категорію" variant="outlined" fullWidth />
                    )}/>
                <TextField
                    onChange={(e) => handleInputChange(e, 'answer')}
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
                    <TextField classes={{root: classes.searchTextField}} variant='outlined' label='Пошук...'/>
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
                                            label: classes.label}}
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
                {deleteDialog}
            </Container>
        </ThemeProvider>
    )
}

export default FAQ