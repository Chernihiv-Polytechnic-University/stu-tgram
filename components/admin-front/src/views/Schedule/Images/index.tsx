import React, {useCallback, useContext, useEffect, useState} from 'react'
import { Button, Grid } from '@material-ui/core'
import Information from '../../../components/Information'
import { AppContext } from '../../../shared/reducer'
import { formatISO, startOfWeek } from 'date-fns'
import ManageDateContainer from './ManageDateContainer'
import GeneratingProgressBar from './GeneratingProgressBar'
import GeneratingResultContainer from './GeneratingResultContainer'

const Images: React.FC = () => {
  const [firstOddWeekMondayDate, setFirstOddWeekMondayDate] = useState(formatISO(startOfWeek(new Date(), { weekStartsOn: 1 }), { representation: 'date' }))
  const [isSetDateSuccess, setSuccessSetDate] = useState<boolean>(false)
  const [isGeneratingStart, setGeneratingStart] = useState<boolean>(false)
  const [isGeneratingFinished, setGeneratingFinished] = useState<boolean>(false)
  const [isGeneratingSuccess, setGeneratingSuccess] = useState<boolean>(false)
  const [all, setAll] = useState<number>(0)
  const [done, setDone] = useState<number>(0)
  const { client } = useContext(AppContext)

  const handleDateChange = (date: any) => {
    if (date === null) return
    setFirstOddWeekMondayDate(formatISO(date, { representation: 'date' }))
    client.updateSystemSettings({ firstOddWeekMondayDate })
      .then((result: any) => {
        console.log(result)
        if (result.isSuccess) {
          setSuccessSetDate(true)
          return
        }
        setSuccessSetDate(false)
      })
  }

  const fetchFirstOddWeekMondayDate = useCallback(async () => {
    await client.getSystemSettings()
      .then((result: any) => {
        console.log(result)
        if (result.isSuccess && result.result.firstOddWeekMondayDate !== null) {
          setFirstOddWeekMondayDate(result.result.firstOddWeekMondayDate)
        }
      })
  }, [client])

  const handleGeneratingClick = async () => {
    setGeneratingStart(true)
    setGeneratingSuccess(false)
    setGeneratingFinished(false)
    setDone(0)
    setAll(0)
    await client.compileImages()
      .then((result: any) => {
        console.log('Result of compiling', result)
        setGeneratingFinished(true)
        setGeneratingStart(false)
        setGeneratingSuccess(result.isSuccess)
      })
  }

  client.onImagesCompiling((args: any) => {
    setAll(args.all)
    setDone(args.left)
  })

  useEffect(() => {
    fetchFirstOddWeekMondayDate()
  }, [fetchFirstOddWeekMondayDate])

  return (<div>
    <Information>
      Календар слугує для налаштування першого понеділка першого тижня навчального тижня<br/>
      Змінювати дату необхідно кожен навчальний рік<br/>
      Натискання кнопки запускає процес компіляції зображень.<br/>
      Перед цим кроком потрібно зібрати інформації про розклад викладачів та ЗВО <br/>
      та завантажити графік навчального процесу на попередніх вкладках<br/>
      Процес компіляції триває до 30 хвилин
    </Information>
    {isGeneratingFinished ? <GeneratingResultContainer isGeneratingSuccess={isGeneratingSuccess}/> : null}
    {(!isGeneratingStart && !isGeneratingSuccess) || (!isGeneratingFinished && isGeneratingSuccess) ? <div>
      <ManageDateContainer
        firstOddWeekMondayDate={firstOddWeekMondayDate}
        handleDateChange={handleDateChange}/>
      <Grid container justify='center' direction='row'>
        <Button
          style={{ marginBottom: '66px' }}
          variant='outlined'
          onClick={handleGeneratingClick}
          color='primary'>
          Генерувати зображення
        </Button>
      </Grid></div> : null}
    {isGeneratingStart ? <GeneratingProgressBar done={done} all={all}/> : null}
  </div>)
}

export default  Images