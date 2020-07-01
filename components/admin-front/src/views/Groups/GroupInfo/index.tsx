import React, {useContext, useState, useEffect, useCallback} from 'react'
import { StudentsGroupAttributes } from 'libs/domain-model'
import {
  Container,
} from '@material-ui/core'
import CustomDialog from '../../../components/CustomDialog'
import { AppContext } from '../../../shared/reducer'

export type Params = {
  groupId: string | null
  onClose: Function
}

const TeacherInfo: React.FC<Params> = ({ groupId, onClose }: Params) => {
  const { client } = useContext(AppContext)
  const [info, setInfo] = useState<StudentsGroupAttributes | null>()


  const fetchGroup = useCallback(async () => {
    if (!groupId) { return }
    const { result, isSuccess } = await client.getGroup({ id: groupId, full: true })
    if (!isSuccess) { return }

    setInfo(result)
  }, [groupId, client])

  useEffect(() => {
    fetchGroup()
  }, [fetchGroup])

  return (
    <CustomDialog
      isOpen={!!groupId}
      title={info?.name ? `${info.name}:${info.subgroupNumber}` : 'Завантаження...'}
      buttonName="Ok"
      handleSubmit={onClose}
      disable={false}
    >
      <Container style={{ width: 848 }}>
        <div />
        {info?.lessonsScheduleImage && <img alt='Educational schedule' src={`data:image/png;base64,${info.educationScheduleImage}`} />}
        {info?.lessonsScheduleImage && <img alt='Lessons schedule' src={`data:image/png;base64,${info.lessonsScheduleImage}`} />}
      </Container>

    </CustomDialog>
  )
}

export default TeacherInfo
