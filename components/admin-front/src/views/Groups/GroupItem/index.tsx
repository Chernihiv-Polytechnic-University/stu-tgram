import React, { useContext, useEffect, useState } from 'react'
import { ListItem, Typography } from '@material-ui/core'
import { AppContext } from '../../../shared/reducer'

interface GroupItemProps {
    createdAt: string
    updatedAt: string
    id: string
}

const GroupItem: React.FC<GroupItemProps> = ({ createdAt, updatedAt, id }: GroupItemProps) => {
  const { client } = useContext(AppContext)

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

  return (
    <ListItem>
      <Typography>{group.name} | {group.subgroupNumber} | Created at {createdAt} | Updated at {updatedAt}</Typography>
    </ListItem>
  )
}

export default GroupItem
