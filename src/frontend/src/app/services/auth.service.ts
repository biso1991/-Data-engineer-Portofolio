import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

// TODO move to global settings module and loaded on app run-time
const AUTH_API = 'http://localhost:8000/api/v1/users/'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API,
      {
        username,
        password
      },
      httpOptions
    )
  }

  register(
    // eslint-disable-next-line camelcase
    first_name: string,
    // eslint-disable-next-line camelcase
    last_name: string,
    email: string,
    username: string,
    password: string
  ): Observable<any> {
    return this.http.post(
      AUTH_API,
      {
        first_name,
        last_name,
        email,
        username,
        password
      },
      httpOptions
    )
  }
}
