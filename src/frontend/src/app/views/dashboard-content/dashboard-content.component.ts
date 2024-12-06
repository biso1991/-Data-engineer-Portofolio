import { MonitoringService } from './../../services/monitoring.service'
import { Monitoring } from './../../models/monitoring.model'
import { Component, OnInit } from '@angular/core'
import {
  Chart,
  ChartConfiguration,
  ChartItem,
  registerables
} from 'node_modules/chart.js'
import { Status } from 'src/app/models/status.model'
import { Task } from 'src/app/models/task'
import { TrainingJobService } from 'src/app/services/training-job.service'
import { UtilsService } from 'src/app/services/utils.service'
import { TaskServiceService } from 'src/app/services/task-service.service'
import { Subscription } from 'rxjs'
import { MessageService } from 'src/app/shared/message.service'
import { AnswerService } from 'src/app/services/answer.service'

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {
  chart: any
  trainingJobsStats: any[] = []
  labels: any[] = []
  values: any[] = []
  listRunningTasks: Task[] = []
  structure: any[] = []
  structureMonitoring: any[] = []
  status: Status = new Status()
  listTrainingJobsMOnitoring: Monitoring[] = []
  listQuestion: any[] = []
  structureQA: any[] = []
  QaCount: number = 0
  private subscription!: Subscription

  constructor(
    private trainingjobService: TrainingJobService,
    private utils: UtilsService,
    private taskServiceService: TaskServiceService,
    private messageService: MessageService,
    private MonitoringService: MonitoringService,
    private answerService: AnswerService
  ) {}

  ngOnInit(): void {
    this.trainingjobService.GetTrainingJobStats().subscribe({
      next: (data: any) => {
        this.trainingJobsStats = data
        this.values = this.trainingJobsStats.map((trainingJobStats: any) => {
          return trainingJobStats[1]
        })
        this.labels = this.trainingJobsStats.map((trainingJobStats: any) => {
          return trainingJobStats[0]
        })
        this.createChart(this.changeValues(this.values))
      },
      error: () => {
        this.utils.Notif('error while getting training job stats', -1)
      }
    })
    this.taskServiceService.GetRunningTasks().subscribe({
      next: (data: any) => {
        this.listRunningTasks = this.transform(data)
      },
      error: () => {
        this.utils.Notif('error while getting running tasks', -1)
      }
    })
    this.MonitoringService.GetMonitoringJobs(
      '',
      '-validation_accuracy',
      1,
      '',
      10
    ).subscribe({
      next: (data: any) => {
        this.listTrainingJobsMOnitoring = this.transformer(data.results)
      },
      error: () => {
        this.utils.Notif('error while getting monitoring jobs', -1)
      }
    })
    this.answerService.GetAnswers('', '-Date', 1, '', 10).subscribe({
      next: (data: any) => {
        this.QaCount = data.count
        this.listQuestion = data.results
      },
      error: () => {
        this.utils.Notif('error while getting questions', -1)
      }
    })
    this.structure = [
      {
        key: 'task_type',
        title: 'Type',
        content: '',
        doNotSort: true
      },
      {
        key: 'project_name',
        title: 'Project',
        content: '',
        doNotSort: true,
        link: {
          enabled: true,
          path: '/dashboard/project/',
          keyname: 'project_id'
        }
      }
    ]
    this.structureQA = [
      {
        key: 'query',
        title: 'Question',
        content: '',
        doNotSort: true,
        link: {
          enabled: true,
          path: '/dashboard/question-answering/single/',
          keyname: ''
        }
      },
      {
        key: 'answer',
        title: 'Answer',
        content: '',
        doNotSort: true
      },
      {
        key: 'project_name',
        title: 'Project',
        sort_key: 'project_id',
        content: '',
        doNotSort: false,
        link: {
          enabled: true,
          path: '/dashboard/project/',
          keyname: 'project_id'
        }
      }
    ]
    this.structureMonitoring = [
      {
        key: 'training_job_name',
        title: 'Training Job',
        content: '',
        doNotSort: true,
        link: {
          enabled: true,
          path: '/dashboard/training-job/single/',
          keyname: 'training_job_id'
        }
      },
      {
        key: 'validation_accuracy',
        title: 'Accuracy',
        content: '',
        doNotSort: true
      },
      {
        key: 'update_date',
        title: 'Date',
        content: '',
        doNotSort: true
      }
    ]
    this.subscription = this.messageService.subject.subscribe((data: any) => {
      this.listRunningTasks = this.listRunningTasks.filter(
        (item: any) => item.task_id !== data.data.task.task_id
      )
    })
  }

  transform(list: any) {
    return list.map((item: any) => {
      if (item.training_job_id === -1) {
        item.task_type = 'Preprocessing'
      } else {
        item.task_type = 'Training'
      }
      item.status = this.status.status.running
      return item
    })
  }

  getDates(days: number) {
    const today = new Date()
    const dates = []
    for (let i = 0; i < days; i++) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i
      )
      dates.push(this.utils.TransferDate(date.toString()))
    }
    return dates.reverse()
  }

  createChart(trainingJobsStats: any) {
    Chart.register(...registerables)
    const data = {
      labels: this.getDates(7),
      datasets: [
        {
          label: 'Training Jobs',
          backgroundColor: [
            '#ff000080',
            '#ffa50082',
            '#ffff0075',
            '#00800078',
            '#0000ff85',
            '#4fc4c080'
          ],
          borderColor: '#ff000000',
          data: trainingJobsStats
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
      type: 'bar',
      data: data,
      options: options
    }
    const chartItem: ChartItem = document.getElementById(
      'my-chart'
    ) as ChartItem
    this.chart = new Chart(chartItem, config)
  }

  changeValues(list: any) {
    list = list.reverse()
    if (list.length < 7) {
      const diff = 7 - list.length
      for (let i = 0; i < diff; i++) {
        list.push(0)
      }
      return list.reverse()
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  transformer(item: any) {
    return item.map((item: any) => {
      item.update_date = this.utils.TransferDate(item.update_date)
      item.validation_accuracy = item.validation_accuracy.toFixed(4)
      return item
    })
  }
}
