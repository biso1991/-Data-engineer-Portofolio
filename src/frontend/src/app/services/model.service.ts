import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { catchError, Observable } from 'rxjs'
import { UtilsService } from './utils.service'
import { UserService } from './user.service'
import { Model } from '../models/model.model'

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  constructor(
    private http: HttpClient,
    private utils: UtilsService,
    private userService: UserService
  ) {}

  // Get All Models Function (GET)
  GetModels(
    search: string = '',
    ordering: string = '',
    page: number = 1,
    PageSize: number = 10,
    filter: string = ''
  ): Observable<Model[]> {
    const query = `?ordering=${ordering}&page=${page}&search=${search}&page_size=${PageSize}&${filter}`
    return this.http
      .get<Model[]>(environment.apiUrl + `api/v1/qa/models/${query}`, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Get Model Function (GET)
  GetModelById(id: number): Observable<Model> {
    return this.http
      .get<Model>(environment.apiUrl + `api/v1/qa/models/${id}/`, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Delete Model Function (DELETE)
  DeleteModel(id: number): Observable<Model> {
    return this.http
      .delete<Model>(environment.apiUrl + `api/v1/qa/models/${id}/`, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Create Model Function (POST)
  CreateModel(FormData: FormData): Observable<any> {
    FormData.append('owner', this.userService.GetLocalUser().id.toString())
    return this.http
      .post<Model>(environment.apiUrl + 'api/v1/qa/models/', FormData, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        },
        reportProgress: true,
        observe: 'events'
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Verify Hugging Face URL (POST)
  VerifyHuggingFaceUrl(url: string): Observable<any> {
    return this.http
      .post<any>(
        environment.apiUrl + 'api/v1/qa/verify_huggingface_url/',
        {
          url: url
        },
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken()
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }
}
