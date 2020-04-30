import * as axios from 'axios'
import * as domain from 'libs/domain-model'
import * as users from './users'
import * as info from './info'
import * as groups from './groups'
import { ManyOutput } from './shared'

export type BaseOptions = {
  baseURL: string,
}

export type Result<R> = {
  isSuccess: boolean
  error?: axios.AxiosError
  result?: R,
}

const execRequest = <I, R>(specificFunc: (input: I) => axios.AxiosRequestConfig, baseOptions: BaseOptions) =>
  async (specificFuncOptions: I): Promise<Result<R>> => {
    return await axios.default({
      withCredentials: true,
      ...baseOptions,
      ...specificFunc(specificFuncOptions),
    }).then((axiosResult) => {
      return { isSuccess: true, result: axiosResult.data }
    }).catch((error) => {
      return { error, isSuccess: false }
    })
  }

export const initClient = (baseOptions: BaseOptions) => ({
  login: execRequest<users.LoginInput, null>(users.login, baseOptions),
  logout: execRequest<{}, null>(users.logout, baseOptions),
  updateMe: execRequest<users.UpdateUserInput, null>(users.updateCurrentUser, baseOptions),
  getMe: execRequest<null, domain.UserAttributes>(users.getCurrentUser, baseOptions),
  getUser: execRequest<users.GetUserInput, domain.UserAttributes>(users.getUser, baseOptions),
  getUsers: execRequest<users.GetUsersInput, ManyOutput<domain.UserAttributes>>(users.getUsers, baseOptions),
  createUser: execRequest<users.CreateUserInput, null>(users.createUser, baseOptions),
  deleteUser: execRequest<users.DeleteUserInput, null>(users.deleteUser, baseOptions),

  getGroup: execRequest<groups.GetGroupInput, domain.StudentsGroupAttributes>(groups.getGroup, baseOptions),
  getGroups: execRequest<groups.GetGroupsInput, ManyOutput<domain.StudentsGroupAttributes>>(groups.getGroups, baseOptions),

  createInfo: execRequest<info.CreateInfoInput, null>(info.createInfo, baseOptions),
  updateInfo: execRequest<info.UpdateInfoInput, null>(info.updateInfo, baseOptions),
  getInfo: execRequest<info.GetInfoInput, domain.InfoAttributes>(info.getInfo, baseOptions),
  getManyInfo: execRequest<info.GetManyInfoInput, ManyOutput<domain.InfoAttributes>>(info.getManyInfo, baseOptions),
  deleteInfo: execRequest<info.DeleteInfoInput, null>(info.deleteInfo, baseOptions),
  getInfoCategories: execRequest<null, domain.InfoCategoryAttributes>(info.getInfoCategories, baseOptions),
})
