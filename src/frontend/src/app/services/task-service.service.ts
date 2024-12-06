import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { catchError, Observable } from 'rxjs'
import { UtilsService } from './utils.service'
import { UserService } from './user.service'
import { Task } from '../models/task'

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
  constructor(
    private http: HttpClient,
    private utils: UtilsService,
    private userService: UserService
  ) {}

  // Get Running Tasks of current user (GET)
  GetRunningTasks(): Observable<Task> {
    return this.http
      .get<Task>(environment.apiUrl + 'api/v1/qa/running_tasks/', {
        headers: {
          Authorization: 'Token ' + this.userService.getToken(),
          'content-type': 'application/json'
        }
      })
      .pipe(catchError(this.utils.handleError))
  }
}
