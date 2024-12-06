import { ResetPasswordEmailComponent } from './views/reset-password-email/reset-password-email.component'
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component'
import { ProfileComponent } from './views/profile/profile.component'
import { SignUpComponent } from './components/sign-up/sign-up.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component'
import { DashboardComponent } from './views/dashboard/dashboard.component'
import { NotfoundComponent } from './views/notfound/notfound.component'
import { ProjectComponent } from './views/project/project.component'
import { SingleProjectComponent } from './views/single-project/single-project.component'
import { AddProjectComponent } from './views/add-project/add-project.component'
import { AddFileComponent } from './views/add-file/add-file.component'
import { FileComponent } from './views/file/file.component'
import { SingleFileComponent } from './views/single-file/single-file.component'
import { NlpmodelComponent } from './views/nlpmodel/nlpmodel.component'
import { AddNlpmodelComponent } from './views/add-nlpmodel/add-nlpmodel.component'
import { TrainingJobComponent } from './views/training-job/training-job.component'
import { AddTrainingJobComponent } from './views/add-training-job/add-training-job.component'
import { SingleTrainingJobComponent } from './views/single-training-job/single-training-job.component'
import { AuthGuard } from './guards/auth.guard'
import { AppComponent } from './app.component'
import { QAComponent } from './views/qa/qa.component'
import { SingleQaComponent } from './views/single-qa/single-qa.component'
import { SingleMonitoringComponent } from './views/single-monitoring/single-monitoring.component'
import { DashboardContentComponent } from './views/dashboard-content/dashboard-content.component'

const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    data: { title: 'Dashboard', breadcrumb: [{ label: 'Dashboard', url: '' }] },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: DashboardContentComponent,
        data: {
          title: 'Home',
          breadcrumb: [{ label: 'Home', url: '' }]
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Profile',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Profile', url: '' }
          ]
        }
      },
      {
        path: 'profile/:p',
        component: ProfileComponent,
        data: {
          title: 'Profile',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Profile', url: 'profile' },
            { label: 'Reset Password', url: '' }
          ]
        }
      },
      { path: 'reset-password-email', component: ResetPasswordEmailComponent },
      {
        path: 'reset-password/:token',
        component: ResetPasswordEmailComponent,
        data: {
          title: 'Profile',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Reset Password', url: '' }
          ]
        }
      },
      {
        path: 'project',
        component: ProjectComponent,
        data: {
          title: 'Projects',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Projects', url: '' }
          ]
        }
      },
      {
        path: 'project/addproject',
        component: AddProjectComponent,
        data: {
          title: 'Project',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Projects', url: 'project' },
            { label: 'Add Project', url: '' }
          ]
        }
      },
      {
        path: 'project/addproject/:id',
        component: AddProjectComponent,
        data: {
          title: 'Project',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Projects', url: 'project' },
            { label: 'Add Project', url: '' }
          ]
        }
      },
      {
        path: 'project/:id',
        component: SingleProjectComponent,
        data: {
          title: 'Project',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Projects', url: 'project' },
            { label: '{{projectName}}', url: '' }
          ]
        }
      },
      {
        path: 'project/:id/:edit',
        component: SingleProjectComponent,
        data: {
          title: 'Project',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Projects', url: 'project' },
            { label: '{{projectName}}', url: '' }
          ]
        }
      },
      {
        path: 'file',
        component: FileComponent,
        data: {
          title: 'Files',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Files', url: '' }
          ]
        }
      },
      {
        path: 'file/addfile',
        component: AddFileComponent,
        data: {
          title: 'Files',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Files', url: 'file' },
            { label: 'Add Files', url: '' }
          ]
        }
      },
      {
        path: 'file/addfile/:id',
        component: AddFileComponent,
        data: {
          title: 'Files',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Files', url: 'file' },
            { label: 'Add Files', url: '' }
          ]
        }
      },
      {
        path: 'file/:id',
        component: FileComponent,
        data: {
          title: 'Files',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Files', url: 'file' },
            { label: 'Files of {{ProjectName}}', url: '' }
          ]
        }
      },
      {
        path: 'file/single/:id',
        component: SingleFileComponent,
        data: {
          title: 'Files',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Files', url: '/dashboard/file' },
            { label: '{{fileName}}', url: '' }
          ]
        }
      },
      {
        path: 'file/single/:id/:edit',
        component: SingleFileComponent,
        data: {
          title: 'Files',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Files', url: '/dashboard/file' },
            { label: '{{fileName}}', url: '' }
          ]
        }
      },
      {
        path: 'model',
        component: NlpmodelComponent,
        data: {
          title: 'Models',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Models', url: '' }
          ]
        }
      },
      {
        path: 'model/addmodel',
        component: AddNlpmodelComponent,
        data: {
          title: 'Models',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Models', url: 'model' },
            { label: 'Add Model', url: '' }
          ]
        }
      },
      {
        path: 'training-job',
        component: TrainingJobComponent,
        data: {
          title: 'TrainingJob',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Training Job', url: '' }
          ]
        }
      },
      {
        path: 'training-job/addtraining-job',
        component: AddTrainingJobComponent,
        data: {
          title: 'TrainingJob',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Training Job', url: 'training-job' },
            { label: 'Add Training Job', url: '' }
          ]
        }
      },
      {
        path: 'training-job/addtraining-job/:id',
        component: AddTrainingJobComponent,
        data: {
          title: 'TrainingJob',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Training Job', url: 'training-job' },
            { label: 'Add Training Job', url: '' }
          ]
        }
      },
      {
        path: 'training-job/:id',
        component: TrainingJobComponent,
        data: {
          title: 'TrainingJob',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Training Job', url: 'training-job' },
            { label: 'Training Job of {{ProjectName}}', url: '' }
          ]
        }
      },
      {
        path: 'training-job/single/:id',
        component: SingleTrainingJobComponent,
        data: {
          title: 'TrainingJob',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Training Job', url: 'training-job' },
            { label: '{{TrainingJob}}', url: '' }
          ]
        }
      },
      {
        path: 'training-job/single/:id/:edit',
        component: SingleTrainingJobComponent,
        data: {
          title: 'TrainingJob',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Training Job', url: 'training-job' },
            { label: '{{TrainingJob}}', url: '' }
          ]
        }
      },
      {
        path: 'question-answering',
        component: QAComponent,
        data: {
          title: 'Answer_Your_Questions',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Answer Your Questions', url: '' }
          ]
        }
      },
      {
        path: 'question-answering/:id',
        component: QAComponent,
        data: {
          title: 'TrainAnswer_Your_QuestionsingJob',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Answer Your Questions', url: 'question-answering' },
            { label: 'Question Answers Of {{ProjectName}}', url: '' }
          ]
        }
      },
      {
        path: 'question-answering/single/:id',
        component: SingleQaComponent,
        data: {
          title: 'TrainAnswer_Your_QuestionsingJob',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Answer Your Questions', url: 'question-answering' },
            { label: '{{question}}', url: '' }
          ]
        }
      },
      {
        path: 'question-answering/single/:id/:edit',
        component: SingleQaComponent,
        data: {
          title: 'TrainAnswer_Your_QuestionsingJob',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Answer Your Questions', url: 'question-answering' },
            { label: '{{question}}', url: '' }
          ]
        }
      },
      {
        path: 'training-job/single/:id/monitoring/:idmonitoring',
        component: SingleMonitoringComponent,
        data: {
          title: 'TrainingJob',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Your Training Job', url: 'training-job' },
            { label: '{{TrainingJob}}', url: 'training-job/single/:id' },
            { label: '{{Monitoring}}', url: '' }
          ]
        }
      }
    ]
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordEmailComponent },
  { path: 'signup', component: SignUpComponent },
  { path: '**', component: NotfoundComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
