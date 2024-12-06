import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import * as _ from 'lodash-es'
import { File } from 'src/app/models/file.model'
import { Project } from 'src/app/models/project.model'
import { FileService } from 'src/app/services/file.service'
import { ProjectService } from 'src/app/services/project.service'
import { UtilsService } from 'src/app/services/utils.service'
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb'
@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  structure: any
  FileList: File[] = []
  FileListToDisplay: File[] = []
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
  fileRemove: File
  itemToRemove: string[]
  PageSize: number = 10
  listProjects: Project[] = []
  searchedProject: Project[] = []
  filterText: string = ''
  filterText2: string = ''
  filterProjectId: number = null
  nextPageProject: string = ''
  filterTextSearch: string = ''
  pageProject: number = 1
  selectedProject: Project = null
  constructor(
    private fileService: FileService,
    private router: Router,
    private utils: UtilsService,
    private ProjectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService
  ) {}

  ngOnInit(): void {
    this.getProjectList()
    this.itemToRemove = ['Answers']
    this.deleteModal = false
    this.listActions = [
      {
        text: 'Change Project',
        icon: 'fa-pencil',
        action: 'edit',
        title: 'Change Project Of File'
      },
      {
        text: 'Delete',
        icon: 'fa-trash',
        action: 'delete',
        title: 'Delete This File'
      }
    ]
    this.searchTerm = ''
    this.structure = [
      {
        key: 'file_name',
        title: 'Name',
        content: '',
        doNotSort: false,
        link: { enabled: true, path: '/dashboard/file/single/', keyname: '' }
      },
      {
        key: 'Project_name',
        title: 'Project',
        content: '',
        sort_key: 'project_f',
        doNotSort: false,
        link: {
          enabled: true,
          path: '/dashboard/project/',
          keyname: 'project_f'
        }
      },
      {
        key: 'update_date',
        title: 'Date',
        content: '',
        doNotSort: false
      },
      {
        key: 'extension',
        title: 'extension',
        content: '',
        doNotSort: false
      },
      {
        key: 'file_size',
        title: 'Size',
        content: '',
        doNotSort: false
      }
    ]
    this.order = { ordering: true, orderBy: '-update_date' }

    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        if (isNaN(params['id'])) {
          this.route.navigate(['/dashboard/file'])
        } else {
          this.filter1Change(params['id'])
          this.filterProjectId = params['id']
          this.ProjectService.GetProjectById(params['id']).subscribe({
            next: (data) => {
              this.filterProjectId = params['id']
              this.onChangedatalist(params['id'])
              this.selectedProject = data
              this.searchedProject = []
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
        this.getfileList()
      }
    })
  }

  setPage(page: number) {
    if (page > 0 && page <= this.numberOfPages) {
      this.pageNumber = page
      this.getfileList()
    }
  }

  orderList(orderBy: string, name: string = null) {
    this.order.ordering = true
    if (orderBy === this.order.orderBy) {
      this.order.orderBy = '-' + orderBy
    } else {
      this.order.orderBy = orderBy
    }
    this.getfileList()
  }

  getfileList() {
    this.searchTerm
      ? (this.deatailsWhileSearching = true)
      : (this.deatailsWhileSearching = false)

    if (this.searchTerm.length >= 1 || this.searchTerm.length === 0) {
      this.fileService
        .GetFiles(
          this.searchTerm,
          this.order.orderBy,
          this.pageNumber,
          this.filterText + this.filterText2,
          this.PageSize
        )
        .subscribe({
          next: (data: any) => {
            this.count = data.count
            this.FileList = _.cloneDeep(data.results)
            this.FileListToDisplay = this.transform(_.cloneDeep(this.FileList))
            this.numberOfPages = this.utils.calculateNumberOfPages(
              this.count,
              this.PageSize
            )
          },
          error: () => {
            this.count = 0
            this.FileList = []
            this.utils.Notif('Error while getting files', -1)
          }
        })
    }
  }

  transform(listItems: any[]) {
    listItems.forEach((item: any) => {
      item.update_date = this.utils.TransferDate(item.update_date)
      item.file_size = this.utils.parseFileSize(item.file_size)
    })
    return listItems
  }

  setSearchTerm(term: string) {
    this.searchTerm = term
    this.getfileList()
  }

  showHideModal(id: number = null) {
    if (id) {
      this.fileRemove = this.FileList.find((item: File) => item.id === id)
    }

    this.deleteModal = !this.deleteModal
  }

  changePageSize(pageSize: number) {
    this.PageSize = pageSize
    this.getfileList()
  }

  DeleteFile(id: number) {
    this.fileService.DeleteFile(id).subscribe({
      next: () => {
        this.utils.Notif('File deleted', 1)
        this.getfileList()
        this.showHideModal()
      },
      error: () => {
        this.utils.Notif('Error while Removing File', -1)
      }
    })
  }

  filter1Change(filter: number) {
    this.filterText = 'project_f=' + filter + '&'

    this.getfileList()
  }

  filter2Change(filter: any) {
    this.filterText2 = 'extension=' + filter + '&'
    this.getfileList()
  }

  editFile(id: number) {
    this.router.navigateByUrl(`/dashboard/file/single/${id}/edit`)
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

  onChangedatalist(idProject: any) {
    if (this.filterText2) {
      this.filterText += 'project_f=' + idProject + '&'
    } else {
      this.filterText = 'project_f=' + idProject + '&'
    }

    this.filterTextSearch = ''
    this.searchedProject = []
    this.getfileList()
  }
}
