import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { UserService } from '../../services/user.service'
import { UtilsService } from '../../services/utils.service'
import { ValidatorsService } from '../../services/validators.service'

@Component({
  selector: 'app-reset-password-email',
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.scss']
})
export class ResetPasswordEmailComponent implements OnInit {
  ResetPasswordForm: FormGroup
  show: boolean
  token: string
  constructor(
    @Inject(DOCUMENT) private document: any,
    private userService: UserService,
    private router: Router,
    private utils: UtilsService,
    private activatedRoute: ActivatedRoute,
    private ValidatorService: ValidatorsService
  ) {
    this.document.body.classList.add('bg-gradient-primary')
  }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.params['token']
    this.userService.VerifyEmailToken({ token: this.token }).subscribe({
      next: (data) => {},
      error: (error: any) => {
        this.utils.Notif(error, -1)
        this.router.navigateByUrl('/forgot-password')
      }
    })
    this.show = false
    this.ResetPasswordForm = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ]),
        passwordco: new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ])
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

  get password() {
    return this.ResetPasswordForm.get('password')
  }

  get passwordco() {
    return this.ResetPasswordForm.get('passwordco')
  }

  ResetPassword() {
    this.userService
      .resetPasswordAction({
        token: this.token,
        password: this.ResetPasswordForm.get('password').value
      })
      .subscribe({
        next: (data) => {
          this.utils.Notif('Your account Password is changed successfully', 1)
          this.router.navigateByUrl('/login')
        },
        error: (error: any) => {
          this.utils.Notif(error, -1)
        }
      })
  }

  showPassword() {
    this.show = !this.show
  }
}
