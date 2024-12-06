import { TrainingJob } from 'src/app/models/training-job.model'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import * as _ from 'lodash-es'
import { Project } from 'src/app/models/project.model'
import { ProjectService } from 'src/app/services/project.service'
import { UtilsService } from 'src/app/services/utils.service'
import { TrainingJobService } from 'src/app/services/training-job.service'
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb'

import { MessageService } from 'src/app/shared/message.service'
import { Subscription } from 'rxjs'
import { Status } from 'src/app/models/status.model'
@Component({
  selector: 'app-training-job',
  templateUrl: './training-job.component.html',
  styleUrls: ['./training-job.component.scss']
})
export class TrainingJobComponent implements OnInit {
  structure: any
  TrainingJobList: TrainingJob[] = []
  TrainingJobToDisplay: TrainingJob[] = []
  searchTerm: string
  count: number = 0
  order: any
  numberOfPages: number
  pageNumber: number
  DisplayedRange: string
  details: any
  displayOrderText: string
  deatailsWhileSearching: boolean
  listActions: any[]
  deleteModal: boolean
  TrainingJobRemove: TrainingJob
  itemToRemove: string[]
  PageSize: number = 10
  listProjects: Project[] = []
  searchedProject: Project[] = []
  filterText: string = ''
  filterText2: string = ''
  filterTextSearch: string = ''
  nextPageProject: string = ''
  pageProject: number = 1
  selectedProject: Project
  subscribed: boolean = false
  status: Status
  private Subscription!: Subscription
  constructor(
    private router: Router,
    private utils: UtilsService,
    private ProjectService: ProjectService,
    private traingJobService: TrainingJobService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.status = new Status()
    this.Subscription = this.messageService.subject.subscribe((data: any) => {
      if (data.data.task.task_type === 0) {
        this.TrainingJobToDisplay.forEach((item) => {
          if (item.id === data.data.task.training_job_id) {
            item.status = data.data.status
          }
        })
      }
    })
    this.getProjectList()
    this.itemToRemove = ['Training Job Monitoring']
    this.deleteModal = false
    this.listActions = [
      {
        text: 'Edit',
        icon: 'fa-pencil',
        action: 'edit',
        title: 'Edit Training Job'
      },
      {
        text: 'Delete',
        icon: 'fa-trash',
        action: 'delete',
        title: 'Delete Training Job'
      },
      {
        text: 'Clone',
        icon: 'fa-clone',
        action: 'clone',
        title: 'Clone Training Job'
      },
      {
        text: 'Start',
        icon: 'fa-play',
        action: 'start',
        title: 'Start Training Job'
      },
      {
        text: 'Stop',
        icon: 'fa-stop',
        action: 'stop',
        title: 'Stop Training Job'
      }
    ]
    this.searchTerm = ''
    this.structure = [
      {
        key: 'name',
        title: 'Name',
        content: '',
        doNotSort: false,
        link: {
          enabled: true,
          path: '/dashboard/training-job/single/',
          keyname: ''
        }
      },
      {
        key: 'Project_name',
        title: 'Project',
        content: '',
        sort_key: 'project',
        doNotSort: false,
        link: {
          enabled: true,
          path: '/dashboard/project/',
          keyname: 'project'
        }
      },
      {
        key: 'status',
        title: 'Status',
        sort_key: 'status',
        content: '<div class="training_job_status finished"></div>',
        doNotSort: false
      },
      {
        key: 'update_date',
        title: 'Date',
        content: '',
        doNotSort: false
      }
    ]
    this.order = { ordering: true, orderBy: '-update_date' }

    this.getTraingJobList()
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        if (isNaN(params['id'])) {
          this.route.navigate(['/dashboard/training-job'])
        } else {
          this.ProjectService.GetProjectById(params['id']).subscribe({
            next: (data) => {
              this.selectedProject = data
              this.searchedProject = []
              this.filter1Change(params['id'])
              const breadcrumb = {
                ProjectName: this.selectedProject.name
              }
              this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(
                breadcrumb
              )
            },
            error: () => {
              this.utils.Notif('Error while getting project', -1)
            }
          })
        }
      } else {
        this.getTraingJobList()
      }
    })
  }

  setPage(page: number) {
    if (page > 0 && page <= this.numberOfPages) {
      this.pageNumber = page
      this.getTraingJobList()
    }
  }

  orderList(orderBy: string, name: string = null) {
    this.order.ordering = true
    if (orderBy === this.order.orderBy) {
      this.order.orderBy = '-' + orderBy
    } else {
      this.order.orderBy = orderBy
    }
    this.getTraingJobList()
  }

  getTraingJobList() {
    this.searchTerm
      ? (this.deatailsWhileSearching = true)
      : (this.deatailsWhileSearching = false)

    if (this.searchTerm.length >= 1 || this.searchTerm.length === 0) {
      this.traingJobService
        .GetTrainingJob(
          this.searchTerm,
          this.order.orderBy,
          this.pageNumber,
          this.filterText + this.filterText2,
          this.PageSize
        )
        .subscribe({
          next: (data: any) => {
            this.count = data.count
            this.TrainingJobList = _.cloneDeep(data.results)
            this.TrainingJobToDisplay = this.transform(
              _.cloneDeep(this.TrainingJobList)
            )
            this.numberOfPages = this.utils.calculateNumberOfPages(
              this.count,
              this.PageSize
            )
          },
          error: () => {
            this.count = 0
            this.TrainingJobList = []
            this.utils.Notif('Error while getting Training Job', -1)
          }
        })
    }
  }

  getProjectList() {
    this.ProjectService.GetProjects(
      this.filterTextSearch,
      '',
      this.pageProject,
      10
    ).subscribe({
      next: (data: any) => {
        // Not Searching
        if (this.filterTextSearch.length <= 1 && this.pageProject > 1) {
          this.listProjects.push(...data.results)
        } else if (
          this.filterTextSearch.length <= 1 &&
          this.pageProject === 1
        ) {
          this.listProjects = data.results
        }
        // Searching
        if (this.filterTextSearch.length > 1 && this.pageProject > 1) {
          this.searchedProject.push(...data.results)
        } else if (this.filterTextSearch.length > 1 && this.pageProject === 1) {
          this.searchedProject = data.results
        }
        this.nextPageProject = data.next
        if (this.nextPageProject !== null) {
          this.pageProject++
        } else {
          this.nextPageProject = ''
          this.pageProject = 1
        }
      },
      error: () => {
        this.listProjects = []
        this.utils.Notif('Error while getting projects', -1)
      }
    })
  }

  transform(listItems: any[]) {
    listItems.forEach((item: any) => {
      item.update_date = this.utils.TransferDateTime(item.update_date)
    })
    return listItems
  }

  setSearchTerm(term: string) {
    this.searchTerm = term
    this.getTraingJobList()
  }

  showHideModal(id: number = null) {
    if (id) {
      this.TrainingJobRemove = this.TrainingJobList.find(
        (item: TrainingJob) => item.id === id
      )
    }

    this.deleteModal = !this.deleteModal
  }

  changePageSize(pageSize: number) {
    this.PageSize = pageSize
    this.getTraingJobList()
  }

  DeleteTrainingJob(id: number) {
    this.traingJobService.DeleteTrainingJob(id).subscribe({
      next: () => {
        this.utils.Notif('Training Job Deleted', 1)
        this.getTraingJobList()
        this.showHideModal()
      },
      error: () => {
        this.utils.Notif('Error while Removing Training Job', -1)
      }
    })
  }

  displayMore(e: boolean) {
    if (e && this.nextPageProject) {
      this.getProjectList()
    }
  }

  searchProject(e: string) {
    this.filterTextSearch = e
    this.pageProject = 1
    if (e.length > 1) {
      this.filterTextSearch = e
    } else {
      this.filterTextSearch = ''
    }
    this.getProjectList()
  }

  filter1Change(filter: number) {
    this.filterText = 'project=' + filter + '&'
    this.getTraingJobList()
  }

  onChangedatalist(idProject: any) {
    this.filterText = 'project=' + idProject + '&'

    if (!idProject) {
      this.filterText = ''
      this.selectedProject = null
    }
    this.filterTextSearch = ''
    this.searchedProject = []
    this.getTraingJobList()
  }

  filter2Change(filter: any) {
    this.filterText2 = 'status=' + filter + '&'
    this.getTraingJobList()
  }

  CloneTrainingJob(id: number) {
    const TrainingJobToClone = this.TrainingJobList.find(
      (item: TrainingJob) => item.id === id
    )
    TrainingJobToClone.status = this.status.status.idle
    if (TrainingJobToClone.name.indexOf('(Cloned)') === -1) {
      TrainingJobToClone.name += ' (Cloned)'
    }
    delete TrainingJobToClone.celery_task_id
    this.traingJobService.InsertTrainingJob(TrainingJobToClone).subscribe({
      next: () => {
        this.utils.Notif('Training Job cloned', 1)
        this.getTraingJobList()
      },
      error: () => {
        this.utils.Notif('Error While Cloning Training Job', -1)
      }
    })
  }

  editTrainingJob(id: number) {
    this.router.navigateByUrl(`/dashboard/training-job/single/${id}/edit`)
  }

  startTraining(id: number) {
    this.traingJobService.TrainingJobActions(id, 1).subscribe({
      next: () => {},
      error: () => {
        this.utils.Notif('Error While Starting Training Job', -1)
      }
    })
  }

  stopTraining(id: number) {
    this.traingJobService.TrainingJobActions(id, 2).subscribe({
      next: () => {
        this.utils.Notif('Training Job will be Stopped Soon', 1)
      },
      error: () => {
        this.utils.Notif('Error While Stopping Training Job', -1)
      }
    })
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe()
  }
}
