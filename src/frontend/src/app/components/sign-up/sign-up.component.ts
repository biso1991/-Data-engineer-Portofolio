import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router'
import { ValidatorsService } from '../../services/validators.service'
import { UtilsService } from '../../services/utils.service'
import { User } from '../../models/user.model'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  user: User
  signUpForm: FormGroup
  show: boolean
  isChecked = new BehaviorSubject(false)
  constructor(
    private userService: UserService,
    private ValidatorService: ValidatorsService,
    private router: Router,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard')
    }

    this.show = false
    this.user = new User()
    this.user.FirstName = ''
    this.user.LastName = ''
    this.user.email = ''
    this.signUpForm = new FormGroup(
      {
        username: new FormControl(this.user.username, [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
          Validators.pattern('[A-Za-z0-9]+')
        ]),
        password: new FormControl(this.user.password, [
          Validators.required,
          Validators.minLength(6)
        ]),
        passwordco: new FormControl(this.user.password, [
          Validators.required,
          Validators.minLength(6)
        ]),
        FirstName: new FormControl(this.user.FirstName, [
          Validators.minLength(3),
          Validators.maxLength(30)
        ]),
        LastName: new FormControl(this.user.LastName, [
          Validators.minLength(3),
          Validators.maxLength(30)
        ]),
        email: new FormControl(this.user.email, [
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
          Validators.required
        ]),
        agreement: new FormControl(
          this.isChecked.value,
          Validators.requiredTrue
        )
      },
      {
        validators: this.ValidatorService.passwordMatch(
          'password',
          'passwordco',
          'match'
        )
      }
    )
  }

  get username() {
    return this.signUpForm.get('username')
  }

  get password() {
    return this.signUpForm.get('password')
  }

  get passwordco() {
    return this.signUpForm.get('passwordco')
  }

  get FirstName() {
    return this.signUpForm.get('FirstName')
  }

  get LastName() {
    return this.signUpForm.get('LastName')
  }

  get email() {
    return this.signUpForm.get('email')
  }

  get agreement() {
    return this.signUpForm.get('agreement')
  }

  SignUp() {
    this.user.username = this.signUpForm.get('username').value
    this.user.password = this.signUpForm.get('password').value
    this.user.FirstName = this.signUpForm.get('FirstName').value
    this.user.LastName = this.signUpForm.get('LastName').value
    this.user.email = this.signUpForm.get('email').value
    this.userService.SignUp(this.user).subscribe({
      next: (data) => {
        // this.userService.setSession(data)
        this.utils.Notif('Your account is created successfully', 1)
        this.router.navigateByUrl('/login')
      },
      error: (error: any) => this.utils.Notif(error, -1)
    })
  }

  showPassword() {
    this.show = !this.show
  }

  agree() {
    this.isChecked.next(!this.isChecked.value)
  }
}
