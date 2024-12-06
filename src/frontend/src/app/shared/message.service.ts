import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  subject: Subject<any> = new Subject<any>()
  subjectMonitoring: Subject<any> = new Subject<any>()
  constructor() {}
}
