import { AnswerService } from './../../services/answer.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb'
import { Answers } from 'src/app/models/answers.model'
import { UtilsService } from 'src/app/services/utils.service'
import * as _ from 'lodash-es'
@Component({
  selector: 'app-single-qa',
  templateUrl: './single-qa.component.html',
  styleUrls: ['./single-qa.component.scss']
})
export class SingleQaComponent implements OnInit {
  Qa: Answers
  QaUpdated: Answers
  editing: boolean = false
  formisvalid: boolean = true
  editFromlist: boolean = false
  firstText: string = ''
  lastText: string = ''
  constructor(
    private activatedRoute: ActivatedRoute,
    private utils: UtilsService,
    private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
    private AnswerService: AnswerService
  ) {}

  ngOnInit(): void {
    this.Qa = new Answers()
    this.QaUpdated = new Answers()
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        if (params['edit'] === 'edit') {
          this.editing = true
          this.editFromlist = true
        }
        this.AnswerService.GetAnswerById(params['id']).subscribe({
          next: (data: any) => {
            this.Qa = data.results[0]
            if (this.Qa.query.indexOf('?') === -1) {
              this.Qa.query = this.Qa.query + ' ?'
            }
            this.Qa.Date = this.utils.TransferDateTime(this.Qa.Date)
            this.Qa.score = (this.Qa.score * 100).toFixed(2) + '%'
            this.QaUpdated = _.cloneDeep(this.Qa)
            const breadcrumb = {
              question: this.Qa.query
            }
            this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(
              breadcrumb
            )
            const indexInContext = this.Qa.context.indexOf(this.Qa.answer)
            const lengthOfAnswer = this.Qa.answer.length
            // Inject <b>answer</b> into context
            this.firstText = this.Qa.context.substring(0, indexInContext)
            this.lastText = this.Qa.context.substring(
              indexInContext + lengthOfAnswer
            )
          },
          error: () => {
            this.utils.Notif('Error while getting Question Answer', -1)
          }
        })
      }
    })
  }

  editEvent() {
    this.QaUpdated = _.cloneDeep(this.Qa)
    this.editing = !this.editing
  }

  verify(e: any, event: boolean = null) {
    if (!e.valid || event) {
      this.formisvalid = false
    } else if (e.valid && !event) {
      this.formisvalid = true
    }
  }

  updateQA() {
    const data = { chosen: this.QaUpdated.chosen }
    this.AnswerService.UpdateAnswer(this.Qa.id, this.Qa.index, data).subscribe({
      next: (data: any) => {
        this.Qa.chosen = this.QaUpdated.chosen
        this.QaUpdated = _.cloneDeep(this.Qa)
        this.utils.Notif('Answer updated', 1)
        this.editing = false
      },
      error: () => {
        this.utils.Notif('Error while updating Answer', -1)
      }
    })
  }
}
