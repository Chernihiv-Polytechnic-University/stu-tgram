import { initClient } from 'libs/admin-back-client'

export const client = initClient({ baseURL: process.env.REACT_APP_API_URL as string })