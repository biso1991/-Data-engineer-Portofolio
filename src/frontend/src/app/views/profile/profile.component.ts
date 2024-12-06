import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { User } from '../../models/user.model'
import { UserService } from '../../services/user.service'
import { UtilsService } from '../../services/utils.service'
import { ValidatorsService } from '../../services/validators.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  status: boolean
  profileCard: boolean
  user: User
  edit: any
  ActiveProfile: boolean
  ResetPassword: boolean
  ResetPasswordshow: boolean
  ResetPasswordForm: FormGroup
  showPassword: boolean
  Modal: boolean
  constructor(
    private userService: UserService,
    private router: Router,
    private utils: UtilsService,
    private activatedRoute: ActivatedRoute,
    private ValidatorService: ValidatorsService
  ) {}

  ngOnInit(): void {
    this.Modal = true
    this.showPassword = false
    this.ActiveProfile = true
    this.ResetPassword = false
    this.profileCard = false
    this.ResetPasswordshow = true
    this.ResetPasswordForm = new FormGroup(
      {
        OldPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ]),
        NewPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ]),
        NewPasswordco: new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ])
      },
      {
        validators: [
          this.ValidatorService.passwordMatch(
            'OldPassword',
            'NewPassword',
            'mismatch'
          ),
          this.ValidatorService.passwordMatch(
            'NewPassword',
            'NewPasswordco',
            'match'
          )
        ]
      }
    )

    this.activatedRoute.params.subscribe((params) => {
      if (params['p'] && params['p'] === 'resetPassword') {
        this.ForgotPasswordToggle()
      }
    })
    this.edit = {
      FirstName: { edit: false, value: '' },
      LastName: { edit: false, value: '' },
      email: { edit: false, value: '' }
    }
    this.user = new User()
    this.status = false

    setTimeout(() => {
      this.user.username = this.userService.GetLocalUser().username
      this.user.id = this.userService.GetLocalUser().id
      this.user.LastName = this.userService.GetLocalUser().last_name
      this.user.FirstName = this.userService.GetLocalUser().first_name
      this.user.email = this.userService.GetLocalUser().email
    }, 100)
  }

  get OldPassword() {
    return this.ResetPasswordForm.get('OldPassword')
  }

  get NewPassword() {
    return this.ResetPasswordForm.get('NewPassword')
  }

  get NewPasswordco() {
    return this.ResetPasswordForm.get('NewPasswordco')
  }

  showPasswordEv() {
    this.showPassword = !this.showPassword
  }

  toogleEvent() {
    this.status = !this.status
  }

  Edit(e: any, editing: boolean) {
    if (!editing) {
      this.edit = {
        ...this.edit,
        [e.name]: { value: this.user[e.name], edit: true }
      }
      document.getElementById(e.name).focus()
    } else {
      this.userService.Update(this.user).subscribe({
        next: (data) => {
          this.userService.UpdateLocalInfo(data)
          this.edit = {
            ...this.edit,
            [e.name]: { value: e.model, edit: false }
          }
          this.utils.Notif('Your account is Updated successfully', 1)
        },
        error: (error: any) => this.utils.Notif(error, -1)
      })
    }
  }

  cancel(e: NgModel) {
    this.user[e.name] = this.edit[e.name].value
    this.edit = {
      ...this.edit,
      [e.name]: { value: this.user[e.name], edit: false }
    }
  }

  ForgotPasswordToggle() {
    this.ActiveProfile = !this.ActiveProfile
    this.ResetPassword = !this.ResetPassword
    this.profileCard = !this.profileCard
    this.ResetPasswordshow = !this.ResetPasswordshow
  }

  ResetPasswordAction() {
    this.userService
      .ResetPassword({
        old_password: this.ResetPasswordForm.get('OldPassword').value,
        new_password: this.ResetPasswordForm.get('NewPassword').value
      })
      .subscribe({
        next: (data) => {
          this.utils.Notif('Your Password is Updated successfully', 1)
          this.router.navigateByUrl('/profile')
        },
        error: (error: any) => this.utils.Notif(error, -1)
      })
  }

  ModalToogle() {
    this.Modal = !this.Modal
  }

  DeleteAccount() {
    this.userService.DeleteUser(this.user).subscribe({
      next: (data) => {
        this.utils.Notif('Your Account Has been deleted successfully', 1)
        this.userService.logout()
        this.router.navigateByUrl('/login')
      },
      error: (error: any) => this.utils.Notif(error, -1)
    })
  }
}
