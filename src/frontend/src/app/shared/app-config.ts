export class AppConfig {
  apiVersion: string = 'v1'
  baseApiURL: string = `http://localhost:8000/api/${this.apiVersion}/`
  userApiURL: string = this.baseApiURL.concat('users/')
  userAuthKey: string = 'auth-user'
  tokenKey: string = 'auth-token'
}
