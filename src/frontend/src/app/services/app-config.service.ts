import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'

import { AppConfig } from '../shared/app-config'

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  constructor() {}

  getSettings(): Observable<AppConfig> {
    const configs = new AppConfig()

    return of(configs)
  }
}
