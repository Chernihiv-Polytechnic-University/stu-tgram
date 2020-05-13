import React, { useContext, useState, useEffect } from 'react'
import { TeacherAttributes } from 'libs/domain-model'
import {
  Container,
} from '@material-ui/core'
import CustomDialog from '../../../components/CustomDialog'
import { AppContext } from '../../../shared/reducer'

export type Params = {
  teacherId: string | null
  onClose: Function
}

const TeacherInfo: React.FC<Params> = ({ teacherId, onClose }: Params) => {
  const { client } = useContext(AppContext)
  const [info, setInfo] = useState<TeacherAttributes | null>()


  const fetchTeacher = async () => {
    if (!teacherId) { return }
    const { result, isSuccess } = await client.getTeacher({ id: teacherId, full: true })
    if (!isSuccess) { return }

    setInfo(result)
  }

  useEffect(() => {
    fetchTeacher()
  }, [teacherId])

  return (
    <CustomDialog
      isOpen={!!teacherId}
      title={info?.name || 'Завантаження...'}
      buttonName="Ok"
      handleSubmit={onClose}
      disable={false}
    >
      <Container style={{ width: 600, height: 600 }}>
        <div />
        {info?.lessonsScheduleImage && <img src={`data:image/png;base64,${info.lessonsScheduleImage}`} />}
      </Container>

    </CustomDialog>
  )
}

export default TeacherInfo
