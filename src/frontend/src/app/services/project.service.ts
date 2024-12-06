import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { catchError, Observable } from 'rxjs'
import { Project } from '../models/project.model'
import { UtilsService } from './utils.service'
import { UserService } from './user.service'

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private http: HttpClient,
    private utils: UtilsService,
    private userService: UserService
  ) {}

  // Get All Projects Function (GET)
  GetProjects(
    search: string = '',
    ordering: string = '',
    page: number = 1,
    PageSize: number
  ): Observable<Project[]> {
    const query = `?ordering=${ordering}&page=${page}&search=${search}&page_size=${PageSize}`
    return this.http
      .get<Project[]>(environment.apiUrl + `api/v1/qa/projects/${query}`, {
        headers: {
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Delete Project Function (DELETE)
  DeleteProject(id: number): Observable<any> {
    return this.http
      .delete<any>(environment.apiUrl + 'api/v1/qa/projects/' + id + '/', {
        headers: {
          'content-type': 'application/json',
          Authorization: 'Token ' + this.userService.getToken()
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Insert Project Function (POST)
  InsertProject(project: Project): Observable<any> {
    return this.http
      .post<any>(
        environment.apiUrl + 'api/v1/qa/projects/',
        this.utils.Stringfy(project),
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken(),
            'content-type': 'application/json'
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Get project by id (GET)
  GetProjectById(id: number): Observable<Project> {
    return this.http
      .get<Project>(environment.apiUrl + 'api/v1/qa/projects/' + id + '/', {
        headers: {
          Authorization: 'Token ' + this.userService.getToken(),
          'content-type': 'application/json'
        }
      })
      .pipe(catchError(this.utils.handleError))
  }

  // Update Project Function (PATCH)
  UpdateProject(obejct: any, id: number): Observable<any> {
    return this.http
      .patch<Project>(
        environment.apiUrl + 'api/v1/qa/projects/' + id + '/',
        this.utils.Stringfy(obejct),
        {
          headers: {
            Authorization: 'Token ' + this.userService.getToken(),
            'content-type': 'application/json'
          }
        }
      )
      .pipe(catchError(this.utils.handleError))
  }

  // Start Preprocessing Function (POST)
  StartPreprocessing(id: number): Observable<any> {
    return this.http
      .post<any>(
        environment.apiUrl + 'api/v1/qa/startpreprocessing/',
        this.utils.Stringfy({ project: id }),
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
