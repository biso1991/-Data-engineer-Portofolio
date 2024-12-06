import { IObjectKeys } from './userInterface'
export class User implements IObjectKeys {
  // eslint-disable-next-line no-undef
  [key: string]: string | number
  id: number
  FirstName: string
  LastName: string
  email: string
  username: string
  password: string
  AuthToken: string
}
