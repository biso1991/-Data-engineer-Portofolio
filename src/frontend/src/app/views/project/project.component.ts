import { Component, OnDestroy, OnInit } from '@angular/core'
import { ProjectService } from 'src/app/services/project.service'
import { UserService } from 'src/app/services/user.service'
import { Router } from '@angular/router'
import { UtilsService } from 'src/app/services/utils.service'
import { Project } from 'src/app/models/project.model'
import { Model } from 'src/app/models/model.model'
import * as _ from 'lodash-es'

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  structure: any
  projects: Project[] = []
  projectsListToDisplay: Project[] = []
  searchTerm: string
  count: number
  order: any
  numberOfPages: number
  pageNumber: number
  DisplayedRange: string
  details: any
  displayOrderText: string
  deatailsWhileSearching: boolean
  listActions: any[]
  deleteModal: boolean
  projectRemove: Project
  itemToRemove: string[]
  modelList: Model[]
  PageSize: number = 10
  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.modelList = []
    this.itemToRemove = ['Training Job', 'Files', 'Monitoring']
    this.deleteModal = false
    this.listActions = [
      {
        text: 'Edit',
        icon: 'fa-pencil',
        action: 'edit',
        title: 'Edit Project'
      },
      {
        text: 'Delete',
        icon: 'fa-trash',
        action: 'delete',
        title: 'Delete This Project'
      },
      {
        text: 'Clone',
        icon: 'fa-clone',
        action: 'clone',
        title: 'Clone this Project'
      },
      {
        text: 'Training Job',
        icon: 'fa-plus',
        action: 'trainingJob',
        title: 'Add Training Job to this Project'
      },
      {
        text: 'Files',
        icon: 'fa-plus',
        action: 'files',
        title: 'Add Files to this Project'
      }
    ]
    this.searchTerm = ''
    this.structure = [
      {
        key: 'name',
        title: 'Name',
        content: '',
        doNotSort: false,
        link: { enabled: true, path: '/dashboard/project/' }
      },
      {
        key: 'description',
        title: 'Description',
        content: '',
        doNotSort: false
      },
      { key: 'store_name', title: 'Store', content: '', doNotSort: false },
      {
        key: 'model_name',
        title: 'Model',
        content: '',
        doNotSort: false,
        sort_key: 'model'
      },
      {
        key: 'update_date',
        title: 'Update Date',
        content: '',
        doNotSort: false
      },
      {
        key: 'latest_training',
        title: 'Latest Training',
        content: '',
        doNotSort: false
      },
      {
        key: 'nb_files',
        title: 'Files',
        content: '',
        doNotSort: true
      }
    ]

    this.order = { ordering: true, orderBy: '-update_date' }

    this.getProjectList()
  }

  setPage(page: number) {
    if (page > 0 && page <= this.numberOfPages) {
      this.pageNumber = page
      this.getProjectList()
    }
  }

  orderList(orderBy: string, name: string = null) {
    this.order.ordering = true
    if (orderBy === this.order.orderBy) {
      this.order.orderBy = '-' + orderBy
    } else {
      this.order.orderBy = orderBy
    }
    this.getProjectList()
  }

  getProjectList() {
    this.searchTerm
      ? (this.deatailsWhileSearching = true)
      : (this.deatailsWhileSearching = false)

    if (this.searchTerm.length >= 1 || this.searchTerm.length === 0) {
      this.projectService
        .GetProjects(
          this.searchTerm,
          this.order.orderBy,
          this.pageNumber,
          this.PageSize
        )
        .subscribe({
          next: (data: any) => {
            this.count = data.count
            this.projects = _.cloneDeep(data.results)
            this.projectsListToDisplay = this.transform(
              _.cloneDeep(this.projects)
            )
            this.numberOfPages = this.utils.calculateNumberOfPages(
              this.count,
              this.PageSize
            )
          },
          error: (e: any) => {
            this.count = 0
            this.projects = []
            this.utils.Notif('Error while getting projects', -1)
          }
        })
    }
  }

  transform(listItems: any[]) {
    listItems.forEach((item: any) => {
      item.update_date = this.utils.TransferDate(item.update_date)
      if (item.latest_training !== 'none') {
        item.latest_training = this.utils.TransferDate(item.latest_training)
      } else {
        item.latest_training = 'Never Trained'
      }
    })
    return listItems
  }

  setSearchTerm(term: string) {
    this.searchTerm = term
    this.getProjectList()
  }

  showHideModal(id: number = null) {
    if (id) {
      this.projectRemove = this.projects.find((item: Project) => item.id === id)
    }

    this.deleteModal = !this.deleteModal
  }

  DeleteProject(id: number) {
    this.projectService.DeleteProject(id).subscribe({
      next: () => {
        this.utils.Notif('Project deleted', 1)
        this.getProjectList()
        this.showHideModal()
      },
      error: () => {
        this.utils.Notif('Error while Removing project', -1)
      }
    })
  }

  CloneProject(id: number) {
    const projectToClone = this.projects.find((item: Project) => item.id === id)
    if (projectToClone.name.indexOf('(Cloned)') === -1) {
      projectToClone.name += ' (Cloned)'
    }
    delete projectToClone.trained_model_path
    this.projectService.InsertProject(projectToClone).subscribe({
      next: () => {
        this.utils.Notif('Project cloned', 1)
        this.getProjectList()
      },
      error: () => {
        this.utils.Notif('Error while cloning project', -1)
      }
    })
  }

  editProject(id: number) {
    this.router.navigateByUrl(`/dashboard/project/${id}/edit`)
  }

  changePageSize(pageSize: number) {
    this.PageSize = pageSize
    this.getProjectList()
  }

  AddTrainingJob(id: number) {
    this.router.navigate(['/dashboard/training-job/addtraining-job/', id])
  }

  addFiles(id: number) {
    this.router.navigate(['/dashboard/file/addfile/', id])
  }

  ngOnDestroy(): void {}
}
