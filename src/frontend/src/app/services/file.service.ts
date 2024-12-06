import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { catchError, Observable } from 'rxjs'
import { UtilsService } from './utils.service'
import { UserService } from './user.service'
import { File } from '../models/file.model'

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(
    private http: HttpClient,
    private utils: UtilsService,
    private userService: UserService
  ) {}

  // Get All Files Function (GET)
  GetFiles(
    search: string = '',
    ordering: string = '',
    page: number = 1,
    filter: string = '',
    PageSize: number
  ): Observable<File[]> {
    const query = `?ordering=${ordering}&page=${page}&search=${search}&page_size=${PageSize}&${filter}`
    return this.http
      .get<File[]>(environment.apiUrl + `api/v1/qa/files/${query}`, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Delete File Function (DELETE)
  DeleteFile(id: number): Observable<any> {
    return this.http
      .delete<any>(environment.apiUrl + 'api/v1/qa/files/' + id + '/', {
        headers: {
          'content-type': 'application/json',
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Create File Function (POST)
  CreateFile(FormData: FormData): Observable<any> {
    return this.http
      .post<File>(environment.apiUrl + 'api/v1/qa/files/', FormData, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        },
        reportProgress: true,
        observe: 'events'
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Get File Function (GET) by id
  GetFile(id: number): Observable<File> {
    return this.http
      .get<File>(environment.apiUrl + 'api/v1/qa/files/' + id + '/', {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Update File Function (Patch)
  UpdateFile(file: File): Observable<any> {
    return this.http
      .patch<any>(
        environment.apiUrl + 'api/v1/qa/files/' + file.id + '/',
        this.utils.Stringfy({ project_f: file.project_f }),
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
