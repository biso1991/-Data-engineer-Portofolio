import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { UtilsService } from 'src/app/services/utils.service'
import { ModelService } from 'src/app/services/model.service'
import { Router } from '@angular/router'
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http'
import { Model } from 'src/app/models/model.model'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-add-nlpmodel',
  templateUrl: './add-nlpmodel.component.html',
  styleUrls: ['./add-nlpmodel.component.scss']
})
export class AddNlpmodelComponent implements OnInit {
  searchTerm: string = ''
  pageNumber: number = 1
  Model: Model = new Model()
  formisvalid: boolean = false
  // -----
  errorFiles: boolean = false
  // -----
  selectedFiles: any[] = []
  selFiles: any[] = []
  progress: number = 0
  uploadInfo: any = {}
  uploadedFiles: any[] = []
  isUploading: boolean = false
  AddFileSubscription: any[] = []
  filesTouched: boolean = false
  active: number = 1
  modelUrl: string = ''
  modelUrlIsValid: boolean = false
  inputTouched: boolean = false
  AddModelSubscriptionSingle: Subscription
  modelIsDownloading: boolean = false
  urlMSG: string = 'Retrieving Model From Huggingface'
  constructor(
    private utils: UtilsService,
    private modelService: ModelService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  @ViewChild('file')
  inputFiles: ElementRef

  verify(e: any, event: boolean = null) {
    if (this.active === 2) {
      if (this.selectedFiles.length === 0) {
        event = true
      } else {
        event = false
      }
      if (!e.valid || event) {
        this.formisvalid = false
      } else if (e.valid && !event) {
        this.formisvalid = true
      }
    } else {
      if (!this.modelUrlIsValid) {
        event = true
      } else {
        event = false
      }
      if (!e.valid || event) {
        this.formisvalid = false
      } else if (e.valid && !event) {
        this.formisvalid = true
      }
    }
    if (this.active === 2) {
      this.selFiles.map((item) => {
        const extension = item.name.split('.').pop()
        if (
          extension.toLowerCase() !== 'zip' &&
          extension.toLowerCase() !== 'rar'
        ) {
          item.error = 'File Type not allowed'
          this.formisvalid = false
        } else {
          item.error = null
        }
        return item
      })
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
        this.formisvalid = false
      }
    }
  }

  fileSelectionChanged(event: any, e: any, dragDrop: boolean = false) {
    this.filesTouched = true
    const fileList = []
    if (dragDrop) {
      for (let i = 0, l = event.length; i < l; i++) {
        if (
          !this.utils.checkIfValueinArray(
            event[i].name,
            this.selFiles,
            'name'
          ) &&
          event.length === 1
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

  AddModelManger(formData: FormData, fileName: string) {
    this.isUploading = true
    this.uploadInfo[fileName] = {
      progress: 0,
      status: 0
    }
    if (this.active === 1) {
      this.AddModelSubscriptionSingle = this.modelService
        .CreateModel(formData)
        .subscribe((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.modelIsDownloading = true
          } else if (event.type === HttpEventType.Response) {
            if (event.status === 201 && event.ok) {
              this.urlMSG = 'Success'
              setTimeout(() => {
                this.modelIsDownloading = false
                this.isUploading = false
                this.utils.Notif('Model Added Successfully', 1)
                this.router.navigate(['/dashboard/model'])
              }, 2000)
            }
          }
        })
    }
    if (this.active === 2) {
      this.AddModelSubscriptionSingle = this.modelService
        .CreateModel(formData)
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
                this.utils.Notif('Model added successfully', 1)
                this.selectedFiles = []
                this.selFiles = []
                // this.File.project_f = null
                this.formisvalid = false
                this.router.navigate(['dashboard/model'])
              }
            } else {
              // this.uploadInfo[fileName].status = 2
              this.utils.Notif('Error while adding Model', -1)
            }
          }
        })
    }
    this.AddFileSubscription.push(this.AddModelSubscriptionSingle)
  }

  AddModel() {
    const formData = new FormData()
    formData.append('model_name', this.Model.model_name)
    if (this.selectedFiles.length && this.active === 2) {
      formData.append('model_file', this.selFiles[0], this.selFiles[0].name)
      this.AddModelManger(formData, this.selFiles[0].name)
    }
    if (this.modelUrl && this.modelUrlIsValid && this.active === 1) {
      this.modelService.VerifyHuggingFaceUrl(this.modelUrl).subscribe({
        next: (data: any) => {
          if (data.message) {
            formData.append('model_ref_url', this.modelUrl)
            this.AddModelManger(formData, this.modelUrl)
          } else {
            this.utils.Notif('Invalid Model Name (HUGGING FACE)', -1)
            this.modelUrlIsValid = false
            this.formisvalid = false
          }
        },
        error: () => {
          this.utils.Notif('Error while Verifying Model Name', -1)
        }
      })
    }
  }

  saveFiles(files: FileList) {
    this.selFiles.push(files)
  }

  clearFiles() {
    if (this.inputFiles) {
      this.inputFiles.nativeElement.value = ''
    }
    this.selectedFiles = []
    this.selFiles = []
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
    this.formisvalid = false
    this.router.navigate(['dashboard/model'])
  }

  DeleteFile(fileName: string, f: any = null) {
    this.selectedFiles = this.selectedFiles.filter(
      (item: any) => item !== fileName
    )
    this.selFiles = this.selFiles.filter((item: any) => item.name !== fileName)
    this.inputFiles.nativeElement.value = ''
    this.verify(f)
  }

  setTab(tab: number) {
    this.active = tab
    this.modelUrl = ''
    this.filesTouched = false
    this.inputTouched = false
    this.clearFiles()
  }

  inputchanged(f: any, e: Event) {
    this.inputTouched = true
    const regex = /(.+){3}(.+)/
    if (regex.test(this.modelUrl)) {
      this.modelUrlIsValid = true
    } else {
      this.modelUrlIsValid = false
    }
    this.verify(f)
  }
}
