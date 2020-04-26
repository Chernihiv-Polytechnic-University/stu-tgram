import React, {useEffect, useState} from 'react'
import {
    Button,
    Container,
    Grid,
    Typography,
    ThemeProvider,
    TextField,
    TableHead,
    TableRow, TableCell, TableBody, Table, makeStyles
} from '@material-ui/core'
import theme from '../../theme'
import { InfoAttributes} from 'libs/domain-model'
import CustomDialog from '../../components/CustomDialog'
import {client} from '../../client'

const INITIAL_NEW_QUESTION: InfoAttributes = {
    question: '',
    answer: '',
    category: ''
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
    const [newQuestion, setQuestion] = useState<InfoAttributes>(INITIAL_NEW_QUESTION)
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false)

    const classes = useStyles()

    const fetchQuestions: any = async () => {
        const { result } = await client.getManyInfo({}) as any
        if (result) {
            setQuestions(result.docs)
        }
    }

    const handleDialogClose: any = () => {
        setDialogOpen(false)
        setQuestion(INITIAL_NEW_QUESTION)
    }

    const handleDialogOpen: any = () => {
        setDialogOpen(true)
    }

    const handleCreateQuestion: any = () => {

    }

    useEffect(() => {
        fetchQuestions()
    }, [])

    console.log(questions)

    const questionCreateDialog =
        <CustomDialog
            isOpen={isDialogOpen}
            handleClose={handleDialogClose}
            disable={false}
            title={'Додати питання'} buttonName={'Створити'} handleSubmit={handleCreateQuestion}>
            <TextField
                value={newQuestion.question}
                variant='outlined'
                label='Введіть питання'
                fullWidth/>
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
                <Grid>
                    <TextField className={classes.searchTextField} variant='outlined' label='Пошук...'/>
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
                                <TableCell/>
                            </TableRow>)
                        })}
                    </TableBody>
                </Table>
            </Container>
        </ThemeProvider>
    )
}

export default FAQ