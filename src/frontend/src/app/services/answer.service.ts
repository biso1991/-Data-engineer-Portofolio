import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { catchError, Observable } from 'rxjs'
import { UtilsService } from './utils.service'
import { UserService } from './user.service'
import { Answers } from '../models/answers.model'

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  constructor(
    private http: HttpClient,
    private utils: UtilsService,
    private userService: UserService
  ) {}

  // Get all answers Function (GET)
  GetAnswers(
    search: string = '',
    ordering: string = '',
    page: number = 1,
    filter: string = '',
    PageSize: number
  ): Observable<Answers[]> {
    const query = `?ordering=${ordering}&page=${page}&search=${search}&page_size=${PageSize}&${filter}`
    return this.http
      .get<Answers[]>(environment.apiUrl + `api/v1/qa/answer/${query}`, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Get Answer By Id Function (GET)
  GetAnswerById(id: any): Observable<Answers> {
    return this.http
      .get<Answers>(environment.apiUrl + `api/v1/qa/answer/${id}/`, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // DElete Answer Function (DELETE)
  DeleteAnswer(id: any, index: any): Observable<any> {
    return this.http
      .delete<Answers>(
        environment.apiUrl + `api/v1/qa/answer/${id}/${index}/`,
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken()
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Update Answer Function (Patch)
  UpdateAnswer(id: any, index: any, data: any): Observable<any> {
    return this.http
      .patch<any>(
        environment.apiUrl + `api/v1/qa/answer/${id}/${index}/`,
        this.utils.Stringfy(data),
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken(),
            'content-type': 'application/json'
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Get Answers From Question Function (POST)
  GetAnswersFromQuestion(project: number, query: string): Observable<any> {
    return this.http
      .post<any>(
        environment.apiUrl + 'api/v1/qa/qa_api/',
        this.utils.Stringfy({ project: project, query: query }),
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken(),
            'content-type': 'application/json'
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Vote On Answers Function (POST)
  VoteOnAnswer(data: any): Observable<any> {
    return this.http
      .post<any>(
        environment.apiUrl + 'api/v1/qa/vote/',
        this.utils.Stringfy(data),
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken(),
            'content-type': 'application/json'
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }
}
