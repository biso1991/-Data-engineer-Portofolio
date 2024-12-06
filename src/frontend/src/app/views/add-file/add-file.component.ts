import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Project } from 'src/app/models/project.model'
import { ProjectService } from 'src/app/services/project.service'
import { UtilsService } from 'src/app/services/utils.service'
import { File } from 'src/app/models/file.model'
import { FileService } from 'src/app/services/file.service'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http'
@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit {
  searchTerm: string = ''
  pageNumber: number = 1
  projects: Project[] = []
  searchedProject: Project[] = []
  nextPageProject: string = ''
  pageProject: number = 1
  File: File = new File()
  selectedProject: Project = null
  formisvalid: boolean = false
  errorFiles: boolean = false
  selectedFiles: any[] = []
  selFiles: any[] = []
  progress: number = 0
  uploadInfo: any = {}
  uploadedFiles: any[] = []
  isUploading: boolean = false
  AddFileSubscription: any[] = []
  filesTouched: boolean = false
  isEditing: boolean = true
  constructor(
    private projectService: ProjectService,
    private utils: UtilsService,
    private fileservice: FileService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProjectList()
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'] && !isNaN(params['id'])) {
        this.File.project_f = params['id']
        this.projectService.GetProjectById(params['id']).subscribe({
          next: (data: any) => {
            this.selectedProject = data
            this.isEditing = false
          },
          error: () => {
            this.utils.Notif('Error while getting project', -1)
          }
        })
      }
    })
  }

  @ViewChild('file')
  inputFiles: ElementRef

  getProjectList() {
    this.projectService
      .GetProjects(this.searchTerm, '', this.pageProject, 10)
      .subscribe({
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
          this.projects = []
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
    this.File.project_f = idProject
    this.verify(e)
  }

  verify(e: any, event: boolean = null) {
    if (this.selectedFiles.length === 0 || !this.File.project_f) {
      event = true
    } else if (event !== true) {
      event = false
    }
    if (!e.valid || event) {
      this.formisvalid = false
    } else if (e.valid && !event) {
      this.formisvalid = true
    }
    this.selFiles.map((item) => {
      const extension = item.name.split('.').pop()
      if (
        extension.toLowerCase() !== 'pdf' &&
        extension.toLowerCase() !== 'txt' &&
        extension.toLowerCase() !== 'docx'
      ) {
        item.error = 'File Type not allowed'
        this.formisvalid = false
      } else if (item.size > 5242880) {
        item.error = 'Max File Size is 5MB'
        this.formisvalid = false
      } else {
        item.error = null
      }
      return item
    })
    // count the number of error !== null inside selFiles
    let count = 0
    this.selFiles.map((item) => {
      if (item.error !== null) {
        count++
      }
      return item
    })
    if (count === 0) {
      this.errorFiles = false
    } else {
      this.errorFiles = true
    }
    // order selfiles by file extension
    this.selFiles.sort((a, b) => {
      const extensionA = a.name.split('.').pop()
      const extensionB = b.name.split('.').pop()
      if (extensionA < extensionB) {
        return -1
      }
      if (extensionA > extensionB) {
        return 1
      }
      return 0
    })
    // place the file with error at the beginning of selFiles
    this.selFiles.map((item) => {
      if (item.error !== null) {
        const index = this.selFiles.indexOf(item)
        this.selFiles.splice(index, 1)
        this.selFiles.unshift(item)
      }
      return item
    })
  }

  fileSelectionChanged(event: any, e: any, dragDrop: boolean = false) {
    this.filesTouched = true
    const fileList = []
    if (dragDrop) {
      for (let i = 0, l = event.length; i < l; i++) {
        if (
          !this.utils.checkIfValueinArray(event[i].name, this.selFiles, 'name')
        ) {
          this.selFiles.push(event[i])
          fileList.push(event[i])
        }
      }
    } else {
      const element = event.currentTarget as HTMLInputElement
      for (let i = 0, l = element.files.length; i < l; i++) {
        if (
          !this.utils.checkIfValueinArray(
            element.files[i].name,
            this.selFiles,
            'name'
          )
        ) {
          this.selFiles.push(element.files[i])
          fileList.push(element.files[i])
        }
      }
    }
    if (fileList) {
      for (const itm in fileList) {
        const item: any = fileList[itm]
        if (
          itm.match(/\d+/g) != null &&
          !this.selectedFiles.includes(item['name'])
        ) {
          this.selectedFiles.push(item['name'])
        }
      }
      this.verify(e)
    }
  }

  AddFileManger(formData: FormData, fileName: string) {
    this.isUploading = true
    this.uploadInfo[fileName] = {
      progress: 0,
      status: 0
    }
    const AddFileSubscriptionSingle = this.fileservice
      .CreateFile(formData)
      .subscribe((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadInfo[fileName].progress = Math.round(
            (100 * event.loaded) / event.total
          )
        } else if (event instanceof HttpResponse) {
          if (event.status === 201) {
            this.uploadInfo[fileName].status = 1
            this.uploadedFiles.push(fileName)
            if (this.selectedFiles.length === this.uploadedFiles.length) {
              this.isUploading = false
              this.utils.Notif('File added successfully', 1)
              this.selectedFiles = []
              this.selFiles = []
              this.projectService
                .StartPreprocessing(this.File.project_f)
                .subscribe({
                  next: (data: any) => {
                    // this.utils.Notif('Preprocessing Files Task Has Started', 1)
                    this.router.navigate(['dashboard/file'])
                  },
                  error: () => {
                    this.utils.Notif('Error while Processing files', -1)
                  }
                })
              this.File.project_f = null
              this.formisvalid = false
            }
          } else {
            this.uploadInfo[fileName].status = 2
            this.utils.Notif('Error while adding files', -1)
          }
        }
      })
    this.AddFileSubscription.push(AddFileSubscriptionSingle)
  }

  AddFiles() {
    if (this.selectedFiles.length) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const formData = new FormData()
        formData.append('project_f', this.File.project_f.toString())
        formData.append('file_f', this.selFiles[i], this.selFiles[i].name)
        this.AddFileManger(formData, this.selFiles[i].name)
      }
    }
  }

  getBackgroundImage(fileName: string) {
    const extension = fileName.split('.').pop()
    let result = ''
    if (extension === 'pdf') {
      result = '/assets/img/pdf.png'
    } else if (extension === 'docx') {
      result = '/assets/img/doc.png'
    } else if (extension === 'txt') {
      result = '/assets/img/txt.png'
    } else {
      result = '/assets/img/file.png'
    }
    return result
  }

  saveFiles(files: FileList) {
    this.selFiles.push(files)
  }

  clearFiles() {
    this.inputFiles.nativeElement.value = ''
    this.selectedFiles = []
    this.selFiles = []
    this.File.file_f = null
    this.formisvalid = false
  }

  click(e: any, fileInput: any = null, f: any = null) {
    if (
      fileInput &&
      e.id !== 'clearFiles' &&
      e.id !== 'clearOneFile' &&
      e.id !== 'SingleFIle' &&
      e.id !== 'SingleFIleName'
    ) {
      fileInput.click()
    } else if (e.id === 'clearFiles') {
      this.clearFiles()
    }
  }

  Cancel() {
    this.AddFileSubscription.map((item: any) => {
      item.unsubscribe()
      return item
    })
    this.selectedFiles = []
    this.selFiles = []
    this.File.project_f = null
    this.formisvalid = false
    this.router.navigate(['dashboard/file'])
  }

  DeleteFile(fileName: string, f: any = null) {
    this.selectedFiles = this.selectedFiles.filter(
      (item: any) => item !== fileName
    )
    this.selFiles = this.selFiles.filter((item: any) => item.name !== fileName)
    this.inputFiles.nativeElement.value = ''
    this.verify(f)
  }
}
