import React, { useEffect, useState } from 'react'
import { ListItem, ListItemAvatar, Typography } from '@material-ui/core'
import { client } from '../../../shared/client'

interface GroupItemProps {
    createdAt: string
    updatedAt: string
    id: string
}

const GroupItem: React.FC<GroupItemProps> = ({ createdAt, updatedAt, id }: GroupItemProps) => {
  const [group, setGroup] = useState<any>({})

  const fetchGroup = async () => {
    const { result } = await client.getGroup({ id: id })
    if (result) {
      setGroup(result)
    }
  }

  useEffect(() => {
    fetchGroup()
  }, [])

  console.log(group)

  return (
    <ListItem>
      <ListItemAvatar>
      </ListItemAvatar>
      <Typography>{group.name} | {group.subgroupNumber} | Created at {createdAt} | Updated at {updatedAt}</Typography>
    </ListItem>
  )
}

export default GroupItem
