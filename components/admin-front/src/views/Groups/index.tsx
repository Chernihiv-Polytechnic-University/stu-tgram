import React, { useEffect, useState } from 'react'
import { List, Container, TextField } from '@material-ui/core'
import GroupItem from './GroupItem'
import { client } from '../../shared/client'

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([])
  const [filteredGroups, setFilteredGroups] = useState<any[]>([])


  const fetchGroups = async () => {
    const { result } = await client.getGroups({})
    if (result) {
      setGroups(result.docs)
      setFilteredGroups(result.docs)
    }
  }

  const toFormatDate = (string: string) => {
    return new Date(string).toUTCString()
  }

  const handleSearchChange: any = (event: React.ChangeEvent<{ value: string }>) => {
    const filtered = groups.filter(group => {
      return group.name.includes(event.target.value)
    })
    setFilteredGroups(filtered)
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return (
    <Container>
      <TextField onChange={handleSearchChange} variant="outlined"/>
      <List>
        {filteredGroups.map(group => {
          return (<GroupItem
            key={group._id}
            createdAt={toFormatDate(group.updatedAt)}
            updatedAt={group.createdAt}
            id={group._id}/>)
        })}
      </List>
    </Container>
  )
}

export default Groups
