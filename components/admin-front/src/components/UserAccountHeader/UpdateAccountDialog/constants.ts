export const INITIAL_ERROR: any = {
  name: false,
  login: false,
  newPassword: false,
  confirmedNewPassword: false
}

export const MAPPER: { [k: string]: RegExp } = {
  login: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  newPassword: /^\w{10,32}$/,
  confirmedNewPassword: /^\w{10,32}$/,
  name: /^\S{6,45}$/
}