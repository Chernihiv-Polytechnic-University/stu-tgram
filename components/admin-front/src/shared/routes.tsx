import Groups from '../views/Groups'
import Login from '../views/Login'
import Users from '../views/Users'
import FAQ from '../views/FAQ'

export const routes = [
  {
    path: '/groups',
    component: Groups
  },
  {
    path: '/',
    component: Login
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/FAQ',
    component: FAQ
  },
]
