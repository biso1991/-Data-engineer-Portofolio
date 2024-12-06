import { Answers } from './../../models/answers.model'
import { AnswerService } from './../../services/answer.service'
import { ModelService } from 'src/app/services/model.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Project } from 'src/app/models/project.model'
import { ProjectService } from 'src/app/services/project.service'
import { UtilsService } from 'src/app/services/utils.service'
import { Model } from 'src/app/models/model.model'
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb'
import { TrainingJobService } from 'src/app/services/training-job.service'
import { TrainingJob } from 'src/app/models/training-job.model'
import { ResizedEvent } from 'angular-resize-event'
import { FileService } from 'src/app/services/file.service'
import { File } from 'src/app/models/file.model'
import { MessageService } from 'src/app/shared/message.service'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-single-project',
  templateUrl: './single-project.component.html',
  styleUrls: ['./single-project.component.scss']
})
export class SingleProjectComponent implements OnInit {
  project: Project = new Project()
  projectUpdated: Project = new Project()
  editing: boolean = false
  formisvalid: boolean = true
  selectedModel: Model
  listModels: Model[]
  nextPageModel: string = ''
  pageModel: number = 1
  searchedModel: Model[] = []
  searchModelTerm: string = ''
  editFromlist: boolean = false
  listTrainingJobs: TrainingJob[] = []
  structure: any[]
  structureAnswers: any[]
  trainingJobExpand: boolean = false
  minheight: number = 440
  maxheight: number = 661
  FilesList: File[] = []
  preprocessingOptions: string[] = ['sliding-window', 'simple-text-splitting']
  splitBy: string[] = ['word', 'sentence', 'passage']
  listAnswers: Answers[] = []
  countA: number = 0
  private Subscription!: Subscription
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private utils: UtilsService,
    private ModelService: ModelService,
    private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
    private TrainingJobService: TrainingJobService,
    private fileservice: FileService,
    private AnswerService: AnswerService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.Subscription = this.messageService.subject.subscribe((data: any) => {
      if (this.listTrainingJobs.length > 0) {
        this.listTrainingJobs.forEach((item) => {
          if (item.id === data.data.task.training_job_id) {
            item.status = data.data.status
          }
        })
      }
    })
    this.structure = [
      {
        key: 'name',
        title: 'Name',
        content: '',
        doNotSort: true,
        link: { enabled: true, path: '/dashboard/training-job/single/' }
      },
      {
        key: 'update_date',
        title: 'Update Date',
        content: '',
        doNotSort: true
      },
      {
        key: 'status',
        title: 'Training Job',
        content: '<div class="training_job_status finished"></div>',
        doNotSort: true
      }
    ]

    this.structureAnswers = [
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
        key: 'score',
        title: 'Score',
        content: '',
        doNotSort: true
      },
      {
        key: 'Date',
        title: 'Date',
        sort_key: 'Date',
        content: '',
        doNotSort: true
      }
    ]
    this.listModels = []

    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        if (params['edit'] === 'edit') {
          this.editing = true
          this.editFromlist = true
        }
        this.projectService.GetProjectById(params['id']).subscribe({
          next: (data: Project) => {
            this.project = data
            this.projectUpdated = { ...data }
            const breadcrumb = {
              projectName: this.project.name
            }
            this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(
              breadcrumb
            )
            this.project.create_date = this.utils.TransferDate(
              this.project.create_date
            )
            this.project.update_date = this.utils.TransferDate(
              this.project.update_date
            )
            this.ModelService.GetModelById(this.project.model).subscribe({
              next: (data: Model) => {
                this.selectedModel = data
              },
              error: () => {
                this.utils.Notif('Error while getting Model', -1)
              }
            })
            this.getModels()
            this.TrainingJobService.GetTrainingJob(
              '',
              '-update_date',
              1,
              `project=${this.project.id}`,
              10
            ).subscribe({
              next: (data: any) => {
                this.listTrainingJobs = this.transformUpdateDate(data.results)
              },
              error: () => {
                this.utils.Notif('Error while getting Training Job', -1)
              }
            })
            this.fileservice
              .GetFiles('', '', 1, `project_f=${this.project.id}`, 10)
              .subscribe({
                next: (data: any) => {
                  this.FilesList = data.results
                },
                error: () => {
                  this.utils.Notif('Error while getting files', -1)
                }
              })
            this.AnswerService.GetAnswers(
              '',
              '-Date',
              1,
              `project_id=${this.project.id}`,
              10
            ).subscribe({
              next: (data: any) => {
                this.listAnswers = data.results
                this.listAnswers = this.transform(this.listAnswers)
                this.countA = data.count
              },
              error: () => {
                this.utils.Notif('Error while getting answers', -1)
              }
            })
          },
          error: () => {
            this.utils.Notif('Error while getting project', -1)
          }
        })
      }
    })
  }

  getModels() {
    this.ModelService.GetModels(
      this.searchModelTerm,
      '',
      this.pageModel,
      10
    ).subscribe({
      next: (data: any) => {
        // Not Searching
        if (this.searchModelTerm.length <= 1 && this.pageModel > 1) {
          this.listModels.push(...data.results)
        } else if (this.searchModelTerm.length <= 1 && this.pageModel === 1) {
          this.listModels = data.results
        }
        // Searching
        if (this.searchModelTerm.length > 1 && this.pageModel > 1) {
          this.searchedModel.push(...data.results)
        } else if (this.searchModelTerm.length > 1 && this.pageModel === 1) {
          this.searchedModel = data.results
        }
        this.nextPageModel = data.next
        if (this.nextPageModel !== null) {
          this.pageModel++
        } else {
          this.nextPageModel = ''
          this.pageModel = 1
        }
      },
      error: () => {
        this.utils.Notif('Error while getting Models', -1)
      }
    })
  }

  editEvent() {
    this.projectUpdated = { ...this.project }
    this.editing = !this.editing
  }

  verify(e: any, event: boolean = null) {
    if (
      this.projectUpdated.model &&
      this.projectUpdated.preprocessing_options &&
      this.projectUpdated.split_by
    ) {
      event = false
    }
    if (!e.valid || event) {
      this.formisvalid = false
    } else if (e.valid && !event) {
      this.formisvalid = true
    }
  }

  onChangedatalist(idModel: any) {
    this.projectUpdated.model = idModel
    if (idModel) {
      this.ModelService.GetModelById(idModel).subscribe({
        next: (data: Model) => {
          this.selectedModel = data
        },
        error: () => {
          this.utils.Notif('Error while getting Model', -1)
        }
      })
    }
  }

  updateProject() {
    this.projectService
      .UpdateProject(
        this.utils.difference(this.projectUpdated, this.project),
        this.project.id
      )
      .subscribe({
        next: (data: any) => {
          this.project = data
          this.projectUpdated = { ...this.project }
          this.utils.Notif('Project updated successfully', 1)
          this.editing = !this.editing
        },
        error: () => {
          this.utils.Notif('Error while updating project', -1)
        }
      })
  }

  transformUpdateDate(listItems: any[]) {
    listItems.forEach((item: any) => {
      item.update_date = this.utils.TransferDate(item.update_date)
    })
    return listItems
  }

  expandToogle() {
    this.trainingJobExpand = !this.trainingJobExpand
  }

  changeSize(e: ResizedEvent) {
    if (e.newRect.height <= this.minheight) {
      this.trainingJobExpand = false
    } else if (e.newRect.height >= this.maxheight) {
      this.trainingJobExpand = true
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
    }
    return result
  }

  displayMore(e: boolean) {
    if (e && this.nextPageModel) {
      this.getModels()
    }
  }

  searchModel(e: string) {
    this.searchModelTerm = e
    this.pageModel = 1
    if (e.length > 1) {
      this.searchModelTerm = e
    } else {
      this.searchModelTerm = ''
      this.projectUpdated.model = null
    }
    this.getModels()
  }

  changeSelect(e: any, f: any, elem: any) {
    if (e !== '' && elem.id === 'preprocessing_options') {
      this.projectUpdated.preprocessing_options = this.preprocessingOptions[e]
      this.verify(f)
    } else if (e === '' && elem.id === 'preprocessing_options') {
      this.projectUpdated.preprocessing_options = null
      this.verify(f, true)
    }
    if (e !== '' && elem.id === 'split_by') {
      this.projectUpdated.split_by = this.splitBy[e]
      this.verify(f)
    } else if (e === '' && elem.id === 'split_by') {
      this.projectUpdated.split_by = null
      this.verify(f, true)
    }
  }

  getIndex(e: string) {
    return this.preprocessingOptions.indexOf(e)
  }

  transform(listItems: any[]) {
    listItems.forEach((item: any) => {
      if (item.query.indexOf('?') === -1) {
        item.query = item.query + ' ?'
      }
      item.Date = this.utils.TransferDateTime(item.Date)
      item.score = (item.score * 100).toFixed(2) + '%'
    })
    return listItems
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe()
  }

  downloadModel() {
    this.utils.downloadFile(
      this.project.trained_model_ref_url,
      this.project.name + '-trained-Model.zip'
    )
  }
}
