import React from 'react'
import { Tabs, Tab, makeStyles } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import styles from './styles'

const useStyles = makeStyles(styles)

const ScheduleTabs: React.FC = () => {
  const history = useHistory()

  const classes = useStyles()

  if (history.location.pathname.endsWith('/schedule')) {
    history.push('/schedule/manage-schedule')
    return null
  }

  const handleTabChange: any = (_: any, value: string) => {
    history.push(value)
  }

  return (
    <Tabs
      classes={{ indicator: classes.tabsStyle }}
      value={history.location.pathname}
      variant='fullWidth'
      onChange={handleTabChange}
    >
      <Tab
        label='Розклад'
        value='/schedule/manage-schedule'
      />
      <Tab
        label='Графік навчального процесу'
        value='/schedule/learning-process'
      />
      <Tab
        label='Зображення'
        value='/schedule/images'
      />
    </Tabs>)
}

export default ScheduleTabs