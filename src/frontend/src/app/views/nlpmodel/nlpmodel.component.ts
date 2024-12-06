/* eslint-disable eqeqeq */
import { UserService } from './../../services/user.service'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Model } from 'src/app/models/model.model'
import { ModelService } from 'src/app/services/model.service'
import * as _ from 'lodash-es'
import { UtilsService } from 'src/app/services/utils.service'

@Component({
  selector: 'app-nlpmodel',
  templateUrl: './nlpmodel.component.html',
  styleUrls: ['./nlpmodel.component.scss']
})
export class NlpmodelComponent implements OnInit {
  structure: any
  Models: Model[] = []
  modelsListToDisplay: Model[] = []
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
  modelRemove: Model
  itemToRemove: string[]
  PageSize: number = 10
  filterText: string = 'scope=0'
  filterText2: string = ''
  constructor(
    private modelService: ModelService,
    private router: Router,
    private userService: UserService,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.Models = []
    this.itemToRemove = []
    this.deleteModal = false
    this.listActions = [
      {
        text: 'Delete',
        icon: 'fa-trash',
        action: 'delete',
        title: 'Delete Model'
      },
      {
        text: 'Add Project',
        icon: 'fa-plus',
        action: 'addproject',
        title: 'Add Project With This Model'
      }
    ]
    this.searchTerm = ''
    this.structure = [
      {
        key: 'model_name',
        title: 'Name',
        content: '',
        doNotSort: false
        // link: { enabled: true, path: '/dashboard/project/' }
      },
      {
        key: 'sourcef',
        title: 'Source',
        sort_key: 'source',
        content: '',
        doNotSort: false
      },

      {
        key: 'update_date',
        title: 'Update Date',
        content: '',
        doNotSort: false
      },
      {
        key: 'model_ref_url',
        title: 'Link',
        content: '',
        doNotSort: true,
        link: { enabled: true, path: '', external: true }
      }
    ]

    this.order = { ordering: true, orderBy: '-update_date' }

    this.getModelList()
  }

  setPage(page: number) {
    if (page > 0 && page <= this.numberOfPages) {
      this.pageNumber = page
      this.getModelList()
    }
  }

  orderList(orderBy: string, name: string = null) {
    this.order.ordering = true
    if (orderBy === this.order.orderBy) {
      this.order.orderBy = '-' + orderBy
    } else {
      this.order.orderBy = orderBy
    }
    this.getModelList()
  }

  getModelList() {
    this.searchTerm
      ? (this.deatailsWhileSearching = true)
      : (this.deatailsWhileSearching = false)
    if (this.searchTerm.length >= 1 || this.searchTerm.length === 0) {
      this.modelService
        .GetModels(
          this.searchTerm,
          this.order.orderBy,
          this.pageNumber,
          this.PageSize,
          this.filterText + '&' + this.filterText2
        )
        .subscribe({
          next: (data: any) => {
            this.count = data.count
            this.Models = _.cloneDeep(data.results)
            this.modelsListToDisplay = this.transform(_.cloneDeep(this.Models))
            this.numberOfPages = this.utils.calculateNumberOfPages(
              this.count,
              this.PageSize
            )
          },
          error: () => {
            this.count = 0
            this.Models = []
            this.utils.Notif('Error while getting Models', -1)
          }
        })
    }
  }

  transform(listItems: any[]) {
    listItems.forEach((item: any) => {
      item.update_date = this.utils.TransferDate(item.update_date)
      if (item.source) {
        item.sourcef = 'Hugging Face'
      } else {
        item.sourcef = 'Uploaded'
      }
      if (!item.model_ref_url) {
        item.model_ref_url = item.model_file
      } else {
        item.model_ref_url = 'https://huggingface.co/' + item.model_ref_url
      }
    })
    return listItems
  }

  setSearchTerm(term: string) {
    this.searchTerm = term
    this.getModelList()
  }

  showHideModal(id: number = null) {
    if (id) {
      this.modelRemove = this.Models.find((item: Model) => item.id === id)
    }

    this.deleteModal = !this.deleteModal
  }

  DeleteModel(id: number) {
    this.modelService.DeleteModel(id).subscribe({
      next: () => {
        this.utils.Notif('Model deleted', 1)
        this.getModelList()
        this.showHideModal()
      },
      error: () => {
        this.utils.Notif('Error while Removing Model', -1)
      }
    })
  }

  changePageSize(pageSize: number) {
    this.PageSize = pageSize
    this.getModelList()
  }

  filter1Change(event: any) {
    if (event == 1) {
      this.filterText2 = 'source=0'
    } else if (event == 2) {
      this.filterText2 = 'source=1'
    } else {
      this.filterText2 = ''
    }
    this.getModelList()
  }

  addProject(id: any) {
    this.router.navigate(['/dashboard/project/addproject/' + id])
  }
}
