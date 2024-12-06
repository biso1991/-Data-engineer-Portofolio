import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { UserService } from '../../services/user.service'
import { ActivatedRoute, Router } from '@angular/router'
import { UtilsService } from '../../services/utils.service'
import { User } from '../../models/user.model'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User
  loginForm: FormGroup
  show: boolean
  returnUrl: string = ''
  constructor(
    private userService: UserService,
    private router: Router,
    private utils: UtilsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.returnUrl) {
        this.returnUrl = params.returnUrl
      }
    })
    if (this.userService.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard')
    }
    this.show = false
    this.user = new User()
    this.loginForm = new FormGroup({
      username: new FormControl(this.user.username, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
        Validators.pattern('[A-Za-z0-9]+')
      ]),
      password: new FormControl(this.user.password, [
        Validators.required,
        Validators.minLength(6)
      ])
    })
  }

  get username() {
    return this.loginForm.get('username')
  }

  get password() {
    return this.loginForm.get('password')
  }

  Login() {
    this.user.username = this.loginForm.get('username').value
    this.user.password = this.loginForm.get('password').value

    this.userService.Login(this.user).subscribe({
      next: (data) => {
        this.userService.setSession(data).subscribe((data) => {
          localStorage.setItem('user', this.utils.Stringfy(data))
          this.utils.Notif('You have been logged in successfully', 1)
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl)
          } else {
            this.router.navigateByUrl('/dashboard')
          }
        })
      },
      error: (error: any) => this.utils.Notif(error, -1)
    })
  }

  showPassword() {
    this.show = !this.show
  }
}
