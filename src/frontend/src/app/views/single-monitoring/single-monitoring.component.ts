import { Monitoring } from 'src/app/models/monitoring.model'
import { Component, OnInit } from '@angular/core'
import { Status } from 'src/app/models/status.model'
import { TrainingJob } from 'src/app/models/training-job.model'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { UtilsService } from 'src/app/services/utils.service'
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb'
import { TrainingJobService } from 'src/app/services/training-job.service'
import { MonitoringService } from 'src/app/services/monitoring.service'
import { MessageService } from 'src/app/shared/message.service'
import {
  Chart,
  ChartConfiguration,
  ChartItem,
  registerables
} from 'node_modules/chart.js'
@Component({
  selector: 'app-single-monitoring',
  templateUrl: './single-monitoring.component.html',
  styleUrls: ['./single-monitoring.component.scss']
})
export class SingleMonitoringComponent implements OnInit {
  status: Status = new Status()
  monitoring: Monitoring
  TrainingJob: TrainingJob
  MonitoringExpand: boolean = false
  minheight: number = 411
  maxheight: number = 535
  trainingJobMonitoring: Monitoring[] = []
  chart: any
  private subscription!: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    private utils: UtilsService,
    private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
    private TrainingJobService: TrainingJobService,
    private monitoringService: MonitoringService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.subscription = this.messageService.subjectMonitoring.subscribe(
      (data: any) => {
        if (data.pk && this.monitoring && data.pk === this.monitoring.id) {
          this.monitoring = data.fields
          this.monitoring.id = data.pk
          const monitoring = [
            this.monitoring.validation_accuracy,
            this.monitoring.training_accuracy,
            this.monitoring.precision,
            this.monitoring.f1_score,
            this.monitoring.recall,
            this.monitoring.sas
          ]
          this.chart.destroy()
          this.createChart(monitoring)
        } else if (data.status === 'stopped') {
          this.monitoringService
            .GetMonitoringJob(this.monitoring.id)
            .subscribe({
              next: (data) => {
                this.monitoring = data
                this.TrainingJob.status = this.status.status.finished
              }
            })
        }
      }
    )
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        if (!isNaN(params['idmonitoring'])) {
          this.monitoringService
            .GetMonitoringJob(params['idmonitoring'])
            .subscribe({
              next: (data) => {
                this.monitoring = data
                const breadcrumb = {
                  Monitoring: this.transformDate(this.monitoring.create_date)
                }
                this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(
                  breadcrumb
                )
                const monitoring = [
                  this.monitoring.validation_accuracy,
                  this.monitoring.training_accuracy,
                  this.monitoring.precision,
                  this.monitoring.f1_score,
                  this.monitoring.recall,
                  this.monitoring.sas
                ]
                this.createChart(monitoring)
                this.TrainingJobService.GetTrainingJobById(
                  params['id']
                ).subscribe({
                  next: (data) => {
                    this.TrainingJob = data
                    const breadcrumb = {
                      TrainingJob: this.TrainingJob.name
                    }
                    this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(
                      breadcrumb
                    )
                  },
                  error: () => {
                    this.utils.Notif('Error while getting Training Job', -1)
                  }
                })
              },
              error: () => {
                this.utils.Notif('Error while getting Monitoring', -1)
              }
            })
        }
      }
    })
  }

  transformDate(date: string) {
    return this.utils.TransferDateTime(date)
  }

  transformPercent(n: number) {
    return n.toFixed(2)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  createChart(monitoring: any) {
    Chart.register(...registerables)
    const data = {
      labels: [
        'Validation Accuracy',
        'Training Accuracy',
        'Precision',
        'F1 score',
        'Recall',
        'Similarity Score'
      ],
      datasets: [
        {
          label: '',
          backgroundColor: [
            '#ff000080',
            '#ffa50082',
            '#ffff0075',
            '#00800078',
            '#0000ff85',
            '#4fc4c080'
          ],
          borderColor: '#ff000000',
          data: monitoring
        }
      ]
    }
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          display: false
        }
      }
    }
    const config: ChartConfiguration = {
      type: 'polarArea',
      data: data,
      options: options
    }
    const chartItem: ChartItem = document.getElementById(
      'my-chart'
    ) as ChartItem
    this.chart = new Chart(chartItem, config)
  }
}
