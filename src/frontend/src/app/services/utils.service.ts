import { Injectable } from '@angular/core'
import { ToastService } from 'angular-toastify'
import { HttpErrorResponse, HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { DatePipe } from '@angular/common'
import * as _ from 'lodash-es'
// import { transform, isEqual, isObject } from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  datepipe: DatePipe
  constructor(
    private _toastService: ToastService,
    private HttpClient: HttpClient
  ) {
    this.datepipe = new DatePipe('en-US')
  }

  Notif(msg: string, type: number) {
    switch (type) {
      case 0:
        this._toastService.info(msg)
        break
      case 1:
        this._toastService.success(msg)
        break
      case -1:
        this._toastService.error(msg)
        break

      default:
        break
    }
  }

  // Handle API errors
  // eslint-disable-next-line node/handle-callback-err
  handleError(error: HttpErrorResponse) {
    return throwError(() => 'Something bad happened , Please try again later.')
  }

  // Funtion to Stringfy an Object
  Stringfy(object: any) {
    return JSON.stringify(object)
  }

  TransferDate(date: string) {
    return this.datepipe.transform(new Date(date), 'dd/MM/yyyy')
  }

  TransferDateTime(date: string) {
    return this.datepipe.transform(new Date(date), 'dd/MM/yyyy - HH:mm')
  }

  difference(object: any, base: any) {
    return _.transform(object, (result: any, value: any, key: any) => {
      if (!_.isEqual(value, base[key])) {
        result[key] =
          _.isObject(value) && _.isObject(base[key])
            ? this.difference(value, base[key])
            : value
      }
    })
  }

  // Calculate the Number of Pages for a given Page Size
  calculateNumberOfPages(count: number, pageSize: number) {
    return Math.ceil(count / pageSize)
  }

  // Parse FileSize to Human Readable
  parseFileSize(size: number) {
    const units = ['Bytes', 'KB', 'MB', 'GB']
    let i = 0
    while (size >= 1024) {
      size /= 1024
      ++i
    }
    return `${Math.round(size * 100) / 100} ${units[i]}`
  }

  // Download File from url with http request
  downloadFile(url: string, filename: string) {
    this.HttpClient.get(url, { responseType: 'blob' }).subscribe(
      (data: any) => {
        const blob = new Blob([data], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        document.body.removeChild(link)
      }
    )
  }

  getLink(string: string): Observable<any> {
    return this.HttpClient.get(string, { responseType: 'blob' })
  }

  checkIfValueinArray(value: any, array: any[], key: string) {
    let result = false
    array.map((item) => {
      if (item[key] === value) {
        result = true
      }
      return item
    })
    return result
  }
}
