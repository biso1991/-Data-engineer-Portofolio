import { Component, OnInit } from '@angular/core'
import { UserService } from '../../services/user.service'
import { UtilsService } from '../../services/utils.service'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  emailAddress: String
  constructor(private userService: UserService, private utils: UtilsService) {}

  ngOnInit(): void {
    this.emailAddress = ''
  }

  ResetPasswordEmail() {
    this.userService
      .SendEmailWithToken({ email: this.emailAddress })
      .subscribe({
        next: (data) => {
          this.utils.Notif('We have sent you an email successfully', 1)
        },
        error: (error: any) => this.utils.Notif(error, -1)
      })
  }
}
