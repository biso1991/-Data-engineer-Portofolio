import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { ToastService, AngularToastifyModule } from 'angular-toastify'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SignUpComponent } from './components/sign-up/sign-up.component'
import { LoginComponent } from './components/login/login.component'
import { HttpClientModule } from '@angular/common/http'
import { DashboardComponent } from './views/dashboard/dashboard.component'
import { NotfoundComponent } from './views/notfound/notfound.component'
import { SidebarComponent } from './components/sidebar/sidebar.component'
import { NavbarComponent } from './components/navbar/navbar.component'
import { ProfileComponent } from './views/profile/profile.component'
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component'
import { ResetPasswordEmailComponent } from './views/reset-password-email/reset-password-email.component'
import { LoadingBarModule } from '@ngx-loading-bar/core'
import { LoadingBarRouterModule } from '@ngx-loading-bar/router'
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client'
import { ProjectComponent } from './views/project/project.component'
import { ClickOutsideModule } from 'ng-click-outside'
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb'
import { ListItemsComponent } from './components/list-items/list-items.component'
import { AutofocusDirective } from './directives/autofocus.directive'
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component'
import { SingleProjectComponent } from './views/single-project/single-project.component'
import { DatalistComponent } from './components/datalist/datalist.component'
import { AngularResizeEventModule } from 'angular-resize-event'
import { AddProjectComponent } from './views/add-project/add-project.component'
import { TrainingJobComponent } from './views/training-job/training-job.component'
import { FileComponent } from './views/file/file.component'
import { AddFileComponent } from './views/add-file/add-file.component'
import { DragDropDirective } from './directives/drag-drop.directive'
import { SingleFileComponent } from './views/single-file/single-file.component'
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { NgxDocViewerModule } from 'ngx-doc-viewer'
import { NlpmodelComponent } from './views/nlpmodel/nlpmodel.component'
import { AddNlpmodelComponent } from './views/add-nlpmodel/add-nlpmodel.component'
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2'
import { AddTrainingJobComponent } from './views/add-training-job/add-training-job.component'
import { SingleTrainingJobComponent } from './views/single-training-job/single-training-job.component'
import { QAComponent } from './views/qa/qa.component'
import { SingleQaComponent } from './views/single-qa/single-qa.component'
import { SingleMonitoringComponent } from './views/single-monitoring/single-monitoring.component'
import {
  MgxCircularProgressModule,
  MgxCircularProgressPieModule
} from 'mgx-circular-progress-bar'
import { DashboardContentComponent } from './views/dashboard-content/dashboard-content.component'
@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    DashboardComponent,
    NotfoundComponent,
    SidebarComponent,
    NavbarComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordEmailComponent,
    ProjectComponent,
    ListItemsComponent,
    AutofocusDirective,
    DeleteModalComponent,
    SingleProjectComponent,
    DatalistComponent,
    AddProjectComponent,
    TrainingJobComponent,
    FileComponent,
    AddFileComponent,
    DragDropDirective,
    SingleFileComponent,
    NlpmodelComponent,
    AddNlpmodelComponent,
    AddTrainingJobComponent,
    SingleTrainingJobComponent,
    QAComponent,
    SingleQaComponent,
    SingleMonitoringComponent,
    DashboardContentComponent
  ],
  imports: [
    BrowserModule,
    AngularToastifyModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    ClickOutsideModule,
    Ng7BootstrapBreadcrumbModule,
    AngularResizeEventModule,
    PdfViewerModule,
    NgxDocViewerModule,
    JwBootstrapSwitchNg2Module,
    MgxCircularProgressModule,
    MgxCircularProgressPieModule
  ],
  providers: [ToastService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}
