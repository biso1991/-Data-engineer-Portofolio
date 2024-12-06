import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { DarkmodeService } from 'src/app/services/darkmode.service'
import { UserService } from '../../services/user.service'
import { UtilsService } from '../../services/utils.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  username: string
  menuExpended: boolean
  darkMode$ = new BehaviorSubject(false)
  constructor(
    private userService: UserService,
    private utils: UtilsService,
    private router: Router,
    private darkmode: DarkmodeService
  ) {}

  @Output() toogleEvent = new EventEmitter<any>()
  handledarkMode = () => {
    if (this.darkmode.getCurrentTheme() === 'Light') {
      document.body.setAttribute('data-theme', 'light')
      this.darkMode$ = new BehaviorSubject<boolean>(false)
    } else if (this.darkmode.getCurrentTheme() === 'Dark') {
      document.body.setAttribute('data-theme', 'dark')
      this.darkMode$ = new BehaviorSubject<boolean>(true)
    }
  }

  ngOnInit(): void {
    this.handledarkMode()

    document.addEventListener(
      'darkmodechangedLocalStorage',
      this.handledarkMode,
      false
    )

    this.menuExpended = false
    setTimeout(() => {
      this.username = this.userService.GetLocalUser().username
    }, 100)
  }

  toogleSidebar() {
    this.toogleEvent.emit()
  }

  showMenuProfile() {
    this.menuExpended = !this.menuExpended
  }

  logout() {
    this.userService.logout()
    this.utils.Notif('You have been logged out successfully', 1)
    this.router.navigateByUrl('/login')
  }

  onToggle() {
    this.darkMode$.next(!this.darkMode$.value)
    if (this.darkMode$.value) {
      document.body.setAttribute('data-theme', 'dark')
      this.darkmode.setTheme('Dark')
    } else {
      document.body.setAttribute('data-theme', 'light')
      this.darkmode.setTheme('Light')
    }
  }
}
