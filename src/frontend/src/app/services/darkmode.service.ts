import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class DarkmodeService {
  constructor() {}

  // Set Theme to Local Storage
  setTheme(theme: any) {
    localStorage.removeItem('theme')
    localStorage.setItem('theme', theme)
  }

  // Get Current Theme Local Storage
  getCurrentTheme() {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme')
    } else {
      this.setTheme('Light')
      return 'Light'
    }
  }
}
