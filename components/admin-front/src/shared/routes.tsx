import Groups from '../views/Groups'
import Teachers from '../views/Teachers'
import Login from '../views/Login'
import Users from '../views/Users'
import FAQ from '../views/FAQ'
import Schedule from '../views/Schedule'
import Images from '../views/Schedule/Images'
import LearningProcess from '../views/Schedule/LearningProcess'
import ManageSchedule from '../views/Schedule/ManageSchedule'

export const routes = [
  {
    path: '/groups',
    component: Groups
  },
  {
    path: '/teachers',
    component: Teachers
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/FAQ',
    component: FAQ
  },
  {
    path: '/schedule',
    component: Schedule,
    routes: [
      {
        path: '/schedule/manage-schedule',
        component: ManageSchedule
      },
      {
        path: '/schedule/learning-process',
        component: LearningProcess
      },
      {
        path: '/schedule/images',
        component: Images
      }
    ]
  },
  {
    path: '/',
    component: Login
  },
]
