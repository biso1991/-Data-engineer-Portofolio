import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb'
import { Project } from 'src/app/models/project.model'
import { TrainingJob } from 'src/app/models/training-job.model'
import { UtilsService } from 'src/app/services/utils.service'
import { TrainingJobService } from 'src/app/services/training-job.service'
import { ResizedEvent } from 'angular-resize-event'
import { Status } from 'src/app/models/status.model'
import * as _ from 'lodash-es'
import { Monitoring } from 'src/app/models/monitoring.model'
import { MonitoringService } from 'src/app/services/monitoring.service'
import { MessageService } from 'src/app/shared/message.service'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-single-training-job',
  templateUrl: './single-training-job.component.html',
  styleUrls: ['./single-training-job.component.scss']
})
export class SingleTrainingJobComponent implements OnInit {
  status: Status = new Status()
  TrainingJob: TrainingJob
  TrainingJobUpdated: TrainingJob
  editing: boolean = false
  formisvalid: boolean = true
  selectedProject: Project
  listProjects: Project[]
  nextPageProject: string = ''
  pageProject: number = 1
  searchedProject: Project[] = []
  searchProjectTerm: string = ''
  editFromlist: boolean = false
  structure: any[]
  MonitoringExpand: boolean = false
  minheight: number = 377
  maxheight: number = 535
  trainingJobMonitoring: Monitoring[] = []
  private Subscription!: Subscription
  constructor(
    private activatedRoute: ActivatedRoute,
    private utils: UtilsService,
    private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
    private TrainingJobService: TrainingJobService,
    private monitoringService: MonitoringService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.Subscription = this.messageService.subject.subscribe((data: any) => {
      if (
        data.data.task.task_type === 0 &&
        data.data.task.training_job_id === this.TrainingJob.id
      ) {
        this.TrainingJob.status = data.data.status
        this.TrainingJobUpdated.status = data.data.status
      }
    })
    this.structure = [
      {
        key: 'create_date',
        title: 'Date',
        content: '',
        doNotSort: true,
        link: {
          enabled: true,
          path: 'monitoring/',
          keyname: ''
        }
      },
      {
        key: 'update_date',
        title: 'Update Date',
        content: '',
        doNotSort: true,
        link: {
          enabled: true,
          path: 'monitoring/',
          keyname: ''
        }
      },
      {
        key: 'f1_score',
        title: 'F1 Score',
        content: '',
        doNotSort: true
      }
    ]
    this.TrainingJob = new TrainingJob()
    this.TrainingJobUpdated = new TrainingJob()

    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        if (params['edit'] === 'edit') {
          this.editing = true
          this.editFromlist = true
        }
        this.TrainingJobService.GetTrainingJobById(params['id']).subscribe({
          next: (data: TrainingJob) => {
            this.TrainingJob = data
            this.TrainingJobUpdated = _.cloneDeep(data)
            const breadcrumb = {
              TrainingJob: this.TrainingJob.name
            }
            this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(
              breadcrumb
            )
            this.TrainingJob.create_date = this.utils.TransferDateTime(
              this.TrainingJob.create_date
            )
            this.TrainingJob.update_date = this.utils.TransferDateTime(
              this.TrainingJob.update_date
            )

            this.monitoringService
              .GetMonitoringJobs(
                '',
                '-create_date',
                1,
                `training_job=${this.TrainingJob.id}`,
                10
              )
              .subscribe({
                next: (data: any) => {
                  if (data.results.length > 0) {
                    this.trainingJobMonitoring = this.transformUpdateDate(
                      data.results
                    )
                  }
                },
                error: () => {
                  this.utils.Notif(
                    'Error while getting Monitoring Information',
                    -1
                  )
                }
              })
          },
          error: () => {
            this.utils.Notif('Error while getting Training Job', -1)
          }
        })
      }
    })
  }

  editEvent() {
    this.TrainingJobUpdated = _.cloneDeep(this.TrainingJob)
    this.editing = !this.editing
  }

  verify(e: any, event: boolean = null) {
    if (!e.valid || event) {
      this.formisvalid = false
    } else if (e.valid && !event) {
      this.formisvalid = true
    }
  }

  transformUpdateDate(listItems: any[]) {
    listItems.forEach((item: any) => {
      item.update_date = this.utils.TransferDateTime(item.update_date)
      item.create_date = this.utils.TransferDateTime(item.create_date)
      item.f1_score = item.f1_score.toFixed(2)
    })
    return listItems
  }

  expandToogle() {
    this.MonitoringExpand = !this.MonitoringExpand
  }

  changeSize(e: ResizedEvent) {
    if (e.newRect.height <= this.minheight) {
      this.MonitoringExpand = false
    } else if (e.newRect.height >= this.maxheight) {
      this.MonitoringExpand = true
    }
  }

  updateTrainingJob() {
    this.TrainingJobService.UpdateTrainingJob(
      this.utils.difference(this.TrainingJobUpdated, this.TrainingJob),
      this.TrainingJob.id
    ).subscribe({
      next: (data: TrainingJob) => {
        this.TrainingJob = data
        this.TrainingJobUpdated = _.cloneDeep(data)
        this.utils.Notif('Training Job updated', 1)
        this.editing = false
      },
      error: () => {
        this.utils.Notif('Error while updating Training Job', -1)
      }
    })
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe()
  }
}
