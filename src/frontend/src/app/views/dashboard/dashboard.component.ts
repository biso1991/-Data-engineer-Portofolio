import { UtilsService } from 'src/app/services/utils.service'
import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { WebsocketService } from 'src/app/services/websocket.service'
import { Task } from 'src/app/models/task'
import { Status } from 'src/app/models/status.model'
import { MessageService } from 'src/app/shared/message.service'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  status: boolean
  listTasks: Task[] = []
  singleTask: Task
  StatusTask: Status
  constructor(
    private cdref: ChangeDetectorRef,
    private WebsocketService: WebsocketService,
    private utils: UtilsService,
    private messageService: MessageService
  ) {}

  ngAfterContentChecked() {
    this.cdref.detectChanges()
  }

  ngOnInit(): void {
    this.StatusTask = new Status()
    this.singleTask = new Task()
    this.status = true
    this.WebsocketService.payload.subscribe((data: any) => {
      if (data.type === 'task_status') {
        this.singleTask = data.data.task
        if (data.data.task.task_type === 1) {
          this.messageService.subject.next(data)
          if (data.data.status === this.StatusTask.status.running) {
            this.utils.Notif(
              `Preprocesssing files of ${this.singleTask.project_name} has started`,
              1
            )
          }
          if (data.data.status === this.StatusTask.status.finished) {
            this.utils.Notif(
              `Preprocesssing files of ${this.singleTask.project_name} finished`,
              1
            )
          }
          if (data.data.status === this.StatusTask.status.failed) {
            this.utils.Notif(
              `Preprocesssing files of ${this.singleTask.project_name} failed`,
              1
            )
          }
        }
        if (data.data.task.task_type === 0) {
          this.messageService.subject.next(data)
          if (data.data.status === this.StatusTask.status.running) {
            this.utils.Notif(
              `Training Job of ${this.singleTask.project_name} has started`,
              1
            )
          }
          if (data.data.status === this.StatusTask.status.finished) {
            this.utils.Notif(
              `Training Job of ${this.singleTask.project_name} finished`,
              1
            )
          }
          if (data.data.status === this.StatusTask.status.failed) {
            this.utils.Notif(
              `Training Job of ${this.singleTask.project_name} has failed with error`,
              1
            )
          }
          if (data.data.status === this.StatusTask.status.aborted) {
            this.utils.Notif(
              `Training Job of ${this.singleTask.project_name} has stopped`,
              1
            )
          }
        }
      } else {
        if (data.data[0].status === 'stopped') {
          this.messageService.subjectMonitoring.next(data.data[0])
        } else {
          this.messageService.subjectMonitoring.next(JSON.parse(data.data)[0])
        }
      }
    })
  }

  toogleEvent() {
    this.status = !this.status
  }
}
