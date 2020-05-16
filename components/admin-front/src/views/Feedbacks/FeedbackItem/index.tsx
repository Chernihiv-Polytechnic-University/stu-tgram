import React, { useState } from 'react'
import { TableRow, TableCell, makeStyles, Typography } from '@material-ui/core'
import { formatISO } from 'date-fns'
import styles from '../styles'

type FeedbackItemProps = {
  feedback: any
}

const useStyles = makeStyles(styles as any)

const FeedbackItem: React.FC<FeedbackItemProps> = (props) => {
  const { feedback } = props
  const [mode, setMode] = useState<string>('closed')
  const classes = useStyles()

  const handleRowClick = () => {
    mode === 'closed' ? setMode('open') : setMode('closed')
  }
  
  if (mode === 'open') {
    return <TableRow onClick={handleRowClick} hover >
      <TableCell style={{ padding: '28px 42px 59px 42px' }} colSpan={5}>
        <Typography style={{ marginBottom: '16px' }} color='textPrimary'>
          <span style={{ fontWeight: 500 }}>ID Telegram: </span>
          {feedback?.author?.username || 'Не відомо'}
        </Typography>
        <Typography style={{ marginBottom: '16px' }} color='textPrimary'>
          <span style={{ fontWeight: 500 }}>Name Telegram: </span>
          {feedback?.author?.name || 'Не відомо'}
        </Typography>
        <Typography style={{ marginBottom: '16px' }} color='textPrimary'>
          <span style={{ fontWeight: 500 }}>Група: </span>
          {feedback?.group?.name || 'Не встановлено'}
        </Typography>
        <Typography style={{ marginBottom: '16px' }} color='textPrimary'>
          <span style={{ fontWeight: 500 }}>Оновлено: </span>
          {formatISO(new Date(feedback.createdAt), { representation: 'date' })}
        </Typography>
        <Typography style={{ marginBottom: '16px' }} color='textPrimary'>
          <span style={{ fontWeight: 500 }}>Відгук:</span>
        </Typography>
        <Typography color='textPrimary'>{feedback?.text}</Typography>
      </TableCell>
    </TableRow>
  }

  return (<TableRow hover onClick={handleRowClick}>
    <TableCell style={{ paddingLeft: '24px' }}><p className={classes.tableRowCellStyle}>{feedback?.text}</p></TableCell>
    <TableCell className={classes.idStyle}>{feedback?.author?.username || 'Не відомо'}</TableCell>
    <TableCell className={classes.nameStyle}>{feedback?.author?.name || 'Не відомо'}</TableCell>
    <TableCell>{feedback?.group?.name || 'Не встановлено'}</TableCell>
    <TableCell>{formatISO(new Date(feedback.createdAt), { representation: 'date' })}</TableCell>
  </TableRow>)
}

export default FeedbackItem