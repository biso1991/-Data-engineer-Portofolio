/* eslint-disable camelcase */
import { Answers, Answers_QA } from 'src/app/models/answers.model'
import { UtilsService } from 'src/app/services/utils.service'
import { AnswerService } from './../../services/answer.service'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Project } from 'src/app/models/project.model'
import { ProjectService } from 'src/app/services/project.service'
import * as _ from 'lodash-es'
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb'
import { FileQA } from 'src/app/models/file.model'
@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss']
})
export class QAComponent implements OnInit, OnDestroy {
  structure: any
  AnswerList: Answers[] = []
  AnswerListToDisplay: Answers[] = []
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
  AnswerRemove: Answers
  itemToRemove: string[]
  PageSize: number = 10
  listProjects: Project[] = []
  searchedProject: Project[] = []
  filterText: string = ''
  filterProjectId: number = null
  nextPageProject: string = ''
  filterTextSearch: string = ''
  pageProject: number = 1
  selectedProject: Project
  Questioning: boolean = false
  // Questions
  Question: string = ''
  QuestionProject: Project = new Project()
  formisvalid: boolean = false
  QuestioningProcessing: boolean = false
  errorFilesNotReady: boolean = false
  QaAnswersList: Answers_QA[] = []
  FileQAList: FileQA[] = []
  rejectedAnswers: number = 0
  acceptedAnswers: number = 0
  fixedCounter: boolean = false
  listner: any = null
  ProjectToverify: Project
  constructor(
    private AnswerService: AnswerService,
    private utils: UtilsService,
    private ProjectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService
  ) {}

  ngOnInit(): void {
    this.getProjectList()
    this.itemToRemove = []
    this.deleteModal = false
    this.listActions = [
      {
        text: 'Update Status',
        icon: 'fa-pencil',
        action: 'edit',
        title: 'Change Answer Status'
      },
      {
        text: 'Delete',
        icon: 'fa-trash',
        action: 'delete',
        title: 'Delete This Answer'
      }
    ]
    this.searchTerm = ''
    this.structure = [
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
        doNotSort: false
      },
      {
        key: 'score',
        title: 'Score',
        content: '',
        doNotSort: false
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
      },
      {
        key: 'chosen',
        title: 'Status',
        sort_key: 'chosen',
        content: '',
        doNotSort: false
      },
      {
        key: 'Date',
        title: 'Date',
        sort_key: 'Date',
        content: '',
        doNotSort: false
      }
    ]
    this.order = { ordering: true, orderBy: '-Date' }

    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        if (isNaN(params['id'])) {
          this.router.navigate(['/dashboard/question-answering/'])
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
        this.getQAList()
      }
    })
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

  setPage(page: number) {
    if (page > 0 && page <= this.numberOfPages) {
      this.pageNumber = page
      this.getQAList()
    }
  }

  orderList(orderBy: string, name: string = null) {
    this.order.ordering = true
    if (orderBy === this.order.orderBy) {
      this.order.orderBy = '-' + orderBy
    } else {
      this.order.orderBy = orderBy
    }
    this.getQAList()
  }

  getQAList() {
    this.searchTerm
      ? (this.deatailsWhileSearching = true)
      : (this.deatailsWhileSearching = false)

    if (this.searchTerm.length >= 1 || this.searchTerm.length === 0) {
      this.AnswerService.GetAnswers(
        this.searchTerm,
        this.order.orderBy,
        this.pageNumber,
        this.filterText,
        this.PageSize
      ).subscribe({
        next: (data: any) => {
          this.count = data.count
          this.AnswerList = _.cloneDeep(data.results)
          this.AnswerListToDisplay = this.transform(
            _.cloneDeep(this.AnswerList)
          )
          this.numberOfPages = this.utils.calculateNumberOfPages(
            this.count,
            this.PageSize
          )
        },
        error: () => {
          this.count = 0
          this.AnswerList = []
          this.utils.Notif('Error while getting Question Answering', -1)
        }
      })
    }
  }

  transform(listItems: any[]) {
    listItems.forEach((item: any) => {
      if (item.query.indexOf('?') === -1) {
        item.query = item.query + ' ?'
      }
      item.Date = this.utils.TransferDateTime(item.Date)
      item.score = (item.score * 100).toFixed(2) + '%'
      if (item.chosen) {
        item.chosen = 'Accepted'
      } else {
        item.chosen = 'Rejected'
      }
    })
    return listItems
  }

  setSearchTerm(term: string) {
    this.searchTerm = term
    this.getQAList()
  }

  showHideModal(id: any = null) {
    if (id) {
      this.AnswerRemove = this.AnswerList.find(
        (item: Answers) => item.id === id
      )
    }

    this.deleteModal = !this.deleteModal
  }

  changePageSize(pageSize: number) {
    this.PageSize = pageSize
    this.getQAList()
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

  onChangedatalist(idProject: any, e: boolean = false, f: any = null) {
    if (e) {
      if (idProject) {
        this.ProjectService.GetProjectById(idProject).subscribe({
          next: (data: any) => {
            this.errorFilesNotReady = !data.files_ready
            if (data.nb_files === 0) {
              this.utils.Notif('No files found in project (add files)', 0)
              this.QuestionProject.id = null
              this.filterTextSearch = ''
              this.searchedProject = []
            } else if (!this.errorFilesNotReady) {
              this.QuestionProject.id = idProject
              this.filterTextSearch = ''
              this.searchedProject = []
              this.verify(f)
            } else {
              this.QuestionProject.id = null
              this.utils.Notif('Files not ready', -1)
              this.filterTextSearch = ''
              this.searchedProject = []
            }
          },
          error: () => {
            this.utils.Notif('Error while getting project', -1)
          }
        })
      } else {
        this.QuestionProject.id = null
        this.filterTextSearch = ''
        this.searchedProject = []
        this.verify(f)
      }
    } else {
      if (idProject) {
        this.filterText = 'project_id=' + idProject + '&'
        this.filterTextSearch = ''
        this.searchedProject = []
        this.getQAList()
      } else {
        this.filterText = ''
        this.filterTextSearch = ''
        this.searchedProject = []
        this.getQAList()
      }
    }
  }

  DeleteAnswer(object: any) {
    const index = object.index
    const id = object.id
    this.AnswerService.DeleteAnswer(id, index).subscribe({
      next: () => {
        this.utils.Notif('Answer deleted', 1)
        const indexLocal = this.getIndexFromlist(id)
        this.AnswerList.splice(indexLocal, 1)
        this.AnswerListToDisplay.splice(indexLocal, 1)
        this.count -= 1
        this.showHideModal()
      },
      error: () => {
        this.utils.Notif('Error while Removing Answer', -1)
      }
    })
  }

  filter1Change(filter: number) {
    this.filterText = 'project_f=' + filter + '&'

    this.getQAList()
  }

  getIndexFromlist(id: any) {
    return this.AnswerList.findIndex((item: Answers) => item.id === id)
  }

  editAnswer(id: any) {
    this.router.navigateByUrl(`/dashboard/question-answering/single/${id}/edit`)
  }

  AsqQuestion() {
    this.QaAnswersList = []
    this.QuestionProject.id = null
    this.filterTextSearch = ''
    this.listProjects = []
    this.searchedProject = []
    this.formisvalid = false
    this.Question = ''
    this.nextPageProject = 'a'
    this.pageProject = 1
    this.getProjectList()
    this.getQAList()
    this.Questioning = !this.Questioning
  }

  verify(e: any, event: boolean = null) {
    if (!e.valid || event === true || !this.QuestionProject.id) {
      this.formisvalid = false
    } else if (
      (e.valid && !event && event !== null) ||
      (e.valid && this.QuestionProject.id)
    ) {
      this.formisvalid = true
    }
  }

  GetAnswersFromQuestion() {
    this.QuestioningProcessing = true
    this.AnswerService.GetAnswersFromQuestion(
      this.QuestionProject.id,
      this.Question
    ).subscribe({
      next: (data: any) => {
        this.ProjectService.GetProjectById(this.QuestionProject.id).subscribe({
          next: (data: any) => {
            this.QuestionProject = data
          },
          error: () => {
            this.utils.Notif('Error while getting Project', -1)
          }
        })
        this.QaAnswersList = data.data.answers
        this.FileQAList = data.data.documents_average
        if (this.QaAnswersList.length === 0) {
          this.utils.Notif('No answers found for : ' + this.Question, 0)
        }
        this.getStatsAnswer(this.QaAnswersList)
        this.QuestioningProcessing = false
        document.addEventListener(
          'scroll',
          () => {
            try {
              const element = document.querySelector('#titleAnswersss')
              const position = element.getBoundingClientRect()

              if (position.top >= 0 && position.bottom <= window.innerHeight) {
                this.fixedCounter = false
              } else if (
                position.top < window.innerHeight &&
                position.bottom >= 0
              ) {
                this.fixedCounter = true
              }
            } catch (e) {}
          },
          false
        )
      },
      error: () => {
        this.QuestioningProcessing = false
        this.utils.Notif('Error while getting Question Answering', -1)
      }
    })
  }

  acceptAnswer(answer: Answers_QA) {
    this.QaAnswersList.map((item: Answers_QA) => {
      if (item === answer && !item.chosen) {
        item.chosen = true
        this.getStatsAnswer(this.QaAnswersList)
      }
      return item
    })
  }

  rejectAnswer(answer: Answers_QA) {
    this.QaAnswersList.map((item: Answers_QA) => {
      if (
        (item === answer && item.chosen) ||
        (item === answer && !item.chosen)
      ) {
        item.chosen = false
        this.getStatsAnswer(this.QaAnswersList)
      }
      return item
    })
  }

  getStatsAnswer(answer: Answers_QA[]) {
    this.acceptedAnswers = 0
    this.rejectedAnswers = 0
    answer.map((item: Answers_QA) => {
      if (item.chosen === true) {
        this.acceptedAnswers++
      }
      if (item.chosen === false) {
        this.rejectedAnswers++
      }
      return item
    })
  }

  ngOnDestroy(): void {
    document.removeEventListener('scroll', () => {}, false)
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

  CancelQuestion() {
    this.QaAnswersList = []
    this.Questioning = false
    this.QuestionProject.id = null
    this.filterTextSearch = ''
    this.searchedProject = []
    this.formisvalid = false
    this.Question = ''
    this.nextPageProject = ''
    this.pageProject = 1
    this.getProjectList()
    this.getQAList()
  }

  VoteQA() {
    this.QaAnswersList.map((item: Answers_QA) => {
      if (!item.chosen) {
        item.chosen = false
      }
      return item
    })
    const object = {
      project: this.QuestionProject.id,
      query: this.Question,
      answers: this.QaAnswersList,
      documents: this.FileQAList
    }
    this.AnswerService.VoteOnAnswer(object).subscribe({
      next: () => {
        setTimeout(() => {
          this.getQAList()
          this.utils.Notif('Vote done', 1)
          this.QaAnswersList = []
          this.FileQAList = []
          this.Questioning = false
          this.QuestionProject.id = null
        }, 1000)
      },
      error: () => {
        this.utils.Notif('Error while voting', -1)
      }
    })
  }

  convertScore(item: any) {
    return (item.score * 100).toFixed(2) + '%'
  }

  getIdFromList(filename: string) {
    try {
      return this.FileQAList.find((item: any) => item.name === filename).id
    } catch {
      return -1
    }
  }
}
