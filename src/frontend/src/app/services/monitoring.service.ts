import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { catchError, Observable } from 'rxjs'
import { UtilsService } from './utils.service'
import { UserService } from './user.service'
@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  constructor(
    private http: HttpClient,
    private utils: UtilsService,
    private userService: UserService
  ) {}

  // Get All Monitoring Jobs Function (GET)
  GetMonitoringJobs(
    search: string = '',
    ordering: string = '',
    page: number = 1,
    filter: string = '',
    PageSize: number
  ): Observable<any> {
    const query = `?ordering=${ordering}&page=${page}&search=${search}&page_size=${PageSize}&${filter}`
    return this.http
      .get<any>(environment.apiUrl + `api/v1/qa/monitoring/${query}`, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Get Monitoring Job Function (GET) By ID
  GetMonitoringJob(id: number): Observable<any> {
    return this.http
      .get<any>(environment.apiUrl + `api/v1/qa/monitoring/${id}/`, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }
}
