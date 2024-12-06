import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { catchError, Observable } from 'rxjs'
import { UtilsService } from './utils.service'
import { UserService } from './user.service'
import { TrainingJob } from '../models/training-job.model'

@Injectable({
  providedIn: 'root'
})
export class TrainingJobService {
  constructor(
    private http: HttpClient,
    private utils: UtilsService,
    private userService: UserService
  ) {}

  // Get All Training Jobs Function (GET)
  GetTrainingJob(
    search: string = '',
    ordering: string = '',
    page: number = 1,
    filter: string = '',
    PageSize: number
  ): Observable<TrainingJob[]> {
    const query = `?ordering=${ordering}&page=${page}&search=${search}&page_size=${PageSize}&${filter}`
    return this.http
      .get<TrainingJob[]>(
        environment.apiUrl + `api/v1/qa/trainingjobs/${query}`,
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken()
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Delete Training Job Function (DELETE)
  DeleteTrainingJob(id: number): Observable<TrainingJob> {
    return this.http
      .delete<TrainingJob>(
        environment.apiUrl + `api/v1/qa/trainingjobs/${id}/`,
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken()
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Insert Training Job Function (POST)
  InsertTrainingJob(trainingJob: TrainingJob): Observable<TrainingJob> {
    return this.http
      .post<TrainingJob>(
        environment.apiUrl + 'api/v1/qa/trainingjobs/',
        this.utils.Stringfy(trainingJob),
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken(),
            'content-type': 'application/json'
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Get training job by id (GET)
  GetTrainingJobById(id: number): Observable<TrainingJob> {
    return this.http
      .get<TrainingJob>(environment.apiUrl + `api/v1/qa/trainingjobs/${id}/`, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken(),
          'content-type': 'application/json'
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Update Training Job Function (PATCH)
  UpdateTrainingJob(
    trainingJob: TrainingJob,
    id: number
  ): Observable<TrainingJob> {
    return this.http
      .patch<TrainingJob>(
        environment.apiUrl + `api/v1/qa/trainingjobs/${id}/`,
        this.utils.Stringfy(trainingJob),
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken(),
            'content-type': 'application/json'
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Training Job Actions Function (POST)
  TrainingJobActions(id: number, action: number): Observable<any> {
    return this.http
      .post<any>(
        environment.apiUrl + 'api/v1/qa/training_action/',
        this.utils.Stringfy({ action: action, training_job: id }),
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken(),
            'content-type': 'application/json'
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Get Training Job Stats (Last week) Function (GET)
  GetTrainingJobStats(): Observable<TrainingJob> {
    return this.http
      .get<TrainingJob>(environment.apiUrl + 'api/v1/qa/training_job_week/', {
        headers: {
          Authorization: 'Token ' + this.userService.getToken(),
          'content-type': 'application/json'
        }
      })
      .pipe(catchError(this.utils.handleError))
  }
}
