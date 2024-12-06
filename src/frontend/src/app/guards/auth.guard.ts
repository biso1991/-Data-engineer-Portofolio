/* eslint-disable brace-style */
/* eslint-disable indent */
import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Router,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router'
import { of, Observable } from 'rxjs'
import { TokenStorageService } from '../services/token-storage.service'
import { UserService } from '../services/user.service'
@Injectable({
  providedIn: 'root'
})
export class AuthGuard
  implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad
{
  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private UserService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUser = this.UserService.GetLocalUser()
    if (currentUser) {
      return of(true)
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
    return of(false)
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true
  }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true
  }
}
