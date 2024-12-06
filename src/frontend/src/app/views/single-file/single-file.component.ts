import { ProjectService } from 'src/app/services/project.service'
import { FileService } from 'src/app/services/file.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { File } from 'src/app/models/file.model'
import { UtilsService } from 'src/app/services/utils.service'
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb'
import { Project } from 'src/app/models/project.model'
@Component({
  selector: 'app-single-file',
  templateUrl: './single-file.component.html',
  styleUrls: ['./single-file.component.scss']
})
export class SingleFileComponent implements OnInit {
  editing: boolean = false
  editFromlist: boolean = false
  file: File
  fileUpdated: File = null
  formisvalid: boolean = false
  projects: Project[] = []
  searchTerm: string = ''
  pageProject: number = 1
  searchedProject: Project[] = []
  nextPageProject: string = ''
  selectedProject: Project
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private FileService: FileService,
    private utils: UtilsService,
    private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
    private ProjectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.file = new File()
    this.selectedProject = null

    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        if (params['edit'] === 'edit') {
          this.editing = true
          this.editFromlist = true
        }
        this.FileService.GetFile(params['id']).subscribe({
          next: (data: File) => {
            this.file = data
            this.fileUpdated = { ...data }
            const breadcrumb = {
              fileName: this.file.file_name
            }
            this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(
              breadcrumb
            )
            this.file.create_date = this.utils.TransferDate(
              this.file.create_date
            )
            this.file.update_date = this.utils.TransferDate(
              this.file.update_date
            )
            this.ProjectService.GetProjectById(this.file.project_f).subscribe({
              next: (data: any) => {
                this.selectedProject = data
              },
              error: () => {
                this.utils.Notif('Error while getting File', -1)
              }
            })
          },
          error: () => {
            this.utils.Notif('Error while getting File', -1)
          }
        })
      }
    })
  }

  getProjectList() {
    this.ProjectService.GetProjects(
      this.searchTerm,
      '',
      this.pageProject,
      10
    ).subscribe({
      next: (data: any) => {
        // Not Searching
        if (this.searchTerm.length <= 1 && this.pageProject > 1) {
          this.projects.push(...data.results)
        } else if (this.searchTerm.length <= 1 && this.pageProject === 1) {
          this.projects = data.results
        }
        // Searching
        if (this.searchTerm.length > 1 && this.pageProject > 1) {
          this.searchedProject.push(...data.results)
        } else if (this.searchTerm.length > 1 && this.pageProject === 1) {
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
        this.utils.Notif('Error while getting Projects', -1)
      }
    })
  }

  displayMore(e: boolean) {
    if (e && this.nextPageProject) {
      this.getProjectList()
    }
  }

  searchProject(e: string) {
    this.searchTerm = e
    this.pageProject = 1
    if (e.length > 1) {
      this.searchTerm = e
    } else {
      this.searchTerm = ''
    }
    this.getProjectList()
  }

  onChangedatalist(idProject: any, e: any) {
    this.file.project_f = idProject
    this.verify(e)
  }

  verify(e: any, event: boolean = null) {
    if (!e.valid || event) {
      this.formisvalid = false
    } else if (e.valid && !event) {
      this.formisvalid = true
    }
  }

  updateFile() {
    this.FileService.UpdateFile(this.file).subscribe({
      next: (data: any) => {
        this.ProjectService.StartPreprocessing(this.file.project_f).subscribe({
          next: () => {},
          error: () => {
            this.utils.Notif('Error While Starting Preprocessing', -1)
          }
        })
        this.utils.Notif('File Updated Successfully', 1)
        this.editing = false
        this.router.navigateByUrl('/dashboard/file/single/' + data.id)
      },
      error: () => {
        this.utils.Notif('Error while updating File', -1)
      }
    })
  }

  editEvent() {
    this.fileUpdated = { ...this.file }
    this.editing = !this.editing
  }

  parseFileSize(bytes: number) {
    return this.utils.parseFileSize(bytes)
  }

  downloadFile() {
    this.utils.downloadFile(this.file.file_f, this.file.file_name)
  }
}
