import { UserService } from './../services/user.service'
/* eslint-disable no-unused-vars */
import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { TokenStorageService } from '../services/token-storage.service'

const TOKEN_HEADER_KEY = 'Authorization'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenStorageService: TokenStorageService,
    private UserService: UserService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let authRequest = request
    const token = this.UserService.getToken()
    if (token != null) {
      authRequest = request.clone({
        headers: request.headers.set(TOKEN_HEADER_KEY, 'Token '.concat(token))
      })
    }

    return next.handle(request)
  }
}
