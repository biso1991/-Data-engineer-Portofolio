/* eslint-disable no-unused-vars */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { catchError, of, Observable } from 'rxjs'
import { User } from '../models/user.model'
import { UtilsService } from './utils.service'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private utils: UtilsService) {}

  // Login Function
  Login(user: User): Observable<User> {
    return this.http
      .post<User>(
        environment.apiUrl + 'api-token-auth/',
        this.utils.Stringfy(user),
        {
          headers: { 'content-type': 'application/json' }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Sign Up Function
  SignUp(user: User): Observable<User> {
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line camelcase
    const { FirstName: first_name, LastName: last_name, ...rest } = user
    const obj = { first_name, last_name, ...rest }
    return this.http
      .post<User>(
        environment.apiUrl + 'api/v1/users/',
        this.utils.Stringfy(obj),
        {
          headers: { 'content-type': 'application/json' }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Update Informations Function
  Update(user: User): Observable<User> {
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line camelcase
    const { FirstName: first_name, LastName: last_name, ...rest } = user
    const obj = { first_name, last_name, ...rest }
    return this.http
      .put<User>(
        environment.apiUrl + 'api/v1/users/' + user.id + '/',
        this.utils.Stringfy(obj),
        {
          headers: {
            'content-type': 'application/json',
            Authorization: 'Token ' + localStorage.getItem('token')
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // GET USER INFO BY ID AND TOKEN
  GetUserInfo(id: string, token: string): Observable<any> {
    return this.http
      .get<any>(environment.apiUrl + 'api/v1/users/' + id + '/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Set session to persist the token in local storage
  setSession(authResult: any): Observable<any> {
    let token = ''
    if (authResult.token) {
      token = authResult.token
    } else {
      token = authResult.AuthToken
    }
    localStorage.setItem('token', token)
    // this.GetUserInfo(authResult.id, token).subscribe((data: any) => {
    //
    // })
    return this.http
      .get<any>(environment.apiUrl + 'api/v1/users/' + authResult.id + '/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .pipe(catchError(this.utils.handleError))
    // return observable of true to indicate successful login
  }

  UpdateLocalInfo(data: User) {
    localStorage.removeItem('user')
    localStorage.setItem('user', this.utils.Stringfy(data))
  }

  GetLocalUser() {
    const userObject = JSON.parse(localStorage.getItem('user'))
    if (userObject) {
      return {
        first_name: userObject.first_name,
        last_name: userObject.last_name,
        email: userObject.email,
        id: userObject.id,
        username: userObject.username
      }
    } else {
      return null
    }
    // return {
    //   first_name: userObject.first_name,
    //   last_name: userObject.last_name,
    //   email: userObject.email,
    //   id: userObject.id,
    //   username: userObject.username
    // }
  }

  // Logout Function
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Verify if the user is still conncted
  isLoggedIn() {
    return !!localStorage.getItem('token')
  }

  // RESET PASSWORD BY OLD PASSWORD
  ResetPassword(data: Object): Observable<Object> {
    return this.http
      .patch<User>(
        environment.apiUrl + 'api/v1/users/' + this.GetLocalUser().id + '/',
        this.utils.Stringfy(data),
        {
          headers: {
            'content-type': 'application/json',
            Authorization: 'Token ' + localStorage.getItem('token')
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // DELETE ACCOUNT
  DeleteUser(user: User): Observable<any> {
    return this.http
      .delete<any>(environment.apiUrl + 'api/v1/users/' + user.id + '/', {
        headers: {
          'content-type': 'application/json',
          Authorization: 'Token ' + localStorage.getItem('token')
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // RESET PASSWORD BY EMAIL (SENDING)
  SendEmailWithToken(data: Object): Observable<Object> {
    return this.http
      .post<any>(
        environment.apiUrl + 'api/password_reset/',
        this.utils.Stringfy(data),
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Testing Token received By Email
  VerifyEmailToken(data: Object): Observable<Object> {
    return this.http
      .post<any>(
        environment.apiUrl + 'api/password_reset/validate_token/',
        this.utils.Stringfy(data),
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Reset Password Action by token and new password
  resetPasswordAction(data: Object): Observable<Object> {
    return this.http
      .post<any>(
        environment.apiUrl + 'api/password_reset/confirm/',
        this.utils.Stringfy(data),
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  getToken(): string {
    return localStorage.getItem('token')
  }
}
