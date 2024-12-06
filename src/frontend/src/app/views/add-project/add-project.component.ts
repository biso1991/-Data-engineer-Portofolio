import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Project } from 'src/app/models/project.model'
import { ProjectService } from 'src/app/services/project.service'
import { UtilsService } from 'src/app/services/utils.service'
import { ModelService } from 'src/app/services/model.service'
import { Model } from 'src/app/models/model.model'
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  project: Project
  modellist: Model[] = []
  formisvalid: boolean = false
  searchedModel: Model[] = []
  nextPageModel: string = ''
  searchModelTerm: string = ''
  pageModel: number = 1
  selectedModel: Model = null
  isEditing: boolean = true
  preprocessingOptions: string[] = ['sliding-window', 'simple-text-splitting']
  splitBy: string[] = ['word', 'sentence', 'passage']
  errorMSG: string = ''
  constructor(
    private router: Router,
    private projectService: ProjectService,
    private utils: UtilsService,
    private ModelService: ModelService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.project = new Project()
    this.project.model = null
    this.project.preprocessing_options = null
    this.project.split_respect_sentence_boundary = false
    this.project.split_by = null
    this.getModels()
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'] && !isNaN(params['id'])) {
        this.project.model = params['id']
        this.ModelService.GetModelById(params['id']).subscribe({
          next: (data: any) => {
            this.selectedModel = data
            this.isEditing = false
          },
          error: () => {
            this.utils.Notif('Error While Getting Model', -1)
          }
        })
      }
    })
  }

  verify(e: any, event: boolean = null) {
    if (
      this.project.model &&
      !event &&
      this.project.preprocessing_options &&
      this.project.split_by
    ) {
      event = false
    }
    if (
      (!e.valid && event === null) ||
      event ||
      (!e.valid && !event) ||
      this.project.reader_count > this.project.retreiver_count
    ) {
      if (this.project.reader_count > this.project.retreiver_count) {
        this.errorMSG = 'Reader count cannot be greater than Retreiver count'
      } else {
        this.errorMSG = ''
      }
      this.formisvalid = false
    } else if (
      e.valid &&
      !event &&
      event !== null &&
      this.project.reader_count <= this.project.retreiver_count
    ) {
      this.formisvalid = true
      this.errorMSG = ''
    }
  }

  onChangedatalist($event: number) {
    this.project.model = $event
  }

  addProject() {
    if (this.project.preprocessing_options === this.preprocessingOptions[0]) {
      if (this.project.split_overlap === null) {
        delete this.project.split_overlap
      }
      if (this.project.split_length === null) {
        delete this.project.split_length
      }
    }
    this.projectService.InsertProject(this.project).subscribe({
      next: (data: any) => {
        this.utils.Notif('Project added successfully', 1)
        this.router.navigate(['dashboard/project'])
      },
      error: () => {
        this.utils.Notif('Error while adding Project', -1)
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
          this.modellist.push(...data.results)
        } else if (this.searchModelTerm.length <= 1 && this.pageModel === 1) {
          this.modellist = data.results
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
      this.project.model = null
    }
    this.getModels()
  }

  changeSelect(e: any, f: any, elem: any) {
    if (e !== '' && elem.id === 'preprocessing_options') {
      this.project.preprocessing_options = this.preprocessingOptions[e]
      this.verify(f)
    } else if (e === '' && elem.id === 'preprocessing_options') {
      this.project.preprocessing_options = null
      this.verify(f, true)
    }
    if (e !== '' && elem.id === 'split_by') {
      this.project.split_by = this.splitBy[e]
      this.verify(f)
    } else if (e === '' && elem.id === 'split_by') {
      this.project.split_by = null
      this.verify(f, true)
    }
  }

  getIndex(e: string) {
    return this.preprocessingOptions.indexOf(e)
  }
}
