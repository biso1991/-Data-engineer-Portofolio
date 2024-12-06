import { Component, Inject } from '@angular/core'
import { environment } from './../environments/environment'
import { Router, NavigationEnd } from '@angular/router'
import { DOCUMENT } from '@angular/common'
import { DarkmodeService } from './services/darkmode.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loadingBar: boolean

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private darkmode: DarkmodeService
  ) {}

  ngOnInit(): void {
    // Detect current route
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (
          val.url.startsWith('/login') ||
          val.url.startsWith('/signup') ||
          val.url.startsWith('/forgot-password') ||
          val.url.includes('reset-password/')
        ) {
          this.loadingBar = true
          this.document.body.classList.add('bg-gradient-primary')
        } else {
          this.loadingBar = false
          this.document.body.classList.remove('bg-gradient-primary')
        }
      }
    })

    if (this.darkmode.getCurrentTheme() === 'Dark') {
      document.body.setAttribute('data-theme', 'dark')
    } else if (this.darkmode.getCurrentTheme() === 'Light') {
      document.body.setAttribute('data-theme', 'light')
    }
    // Check if the dark-mode Media-Query matches
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        if (event.matches) {
          // dark mode
          this.darkmode.setTheme('Dark')
          const event = new Event('darkmodechangedLocalStorage')
          document.dispatchEvent(event)
        } else {
          // light mode
          this.darkmode.setTheme('Light')
          const event = new Event('darkmodechangedLocalStorage')
          document.dispatchEvent(event)
        }
      })
  }

  title = environment.title
}
