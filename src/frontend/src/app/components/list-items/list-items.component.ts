/* eslint-disable camelcase */
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { Status } from 'src/app/models/status.model'
import { UtilsService } from 'src/app/services/utils.service'
@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ListItemsComponent implements OnInit, AfterViewInit {
  status: Status
  listItems: any[] = []
  actionsList: any[]
  structure: any[] = []
  keys: any[]
  titles: string[]
  searchInput: boolean = false
  searchTerm: string
  count: number = 0
  order: any
  numberOfPages: number
  pageNumber: number
  DisplayedRange: string
  details: any
  displayOrderText: string
  deatailsWhileSearching: boolean
  entityNamee: string
  pagination: boolean = true
  topBarListing: boolean = true
  actionsButtons: boolean = true
  custom_Order: boolean = false
  page_size: number = 10
  listFilter1: any[] = []
  keynameFilter1: string = ''
  filterisActive: boolean = false
  filter1Id: number
  filter_name_model: string = ''
  // FILTER 2
  listFilter2: any[] = []
  keynameFilter2: string = ''
  filter2isActive: boolean = false
  filter2Id: number
  filter_name_model2: string = ''
  filter_preposition1: string = ''
  typeFilterDynamic: boolean = false
  searchedItems: any[] = []
  displayErrors: boolean = true
  selectedFilter1: any = null
  searchValid: boolean = true
  constructor(private utils: UtilsService) {}

  @ViewChild('#search', { static: false })
  set input(element: ElementRef<HTMLInputElement>) {
    if (element) {
      element.nativeElement.focus()
    }
  }

  ngOnInit(): void {
    this.status = new Status()
    this.keys = this.structure.map((item: any) => item.key)
    this.titles = this.structure.map((item: any) => item.title)
    this.deatailsWhileSearching = false
    this.displayOrderText = '| Order by : Date (Descending)'
    this.DisplayedRange = ''
    this.pageNumber = 1
    this.numberOfPages = 0
    this.order = { ordering: true, orderBy: '-update_date' }
    this.details = { id: null, open: false }
    this.searchTerm = ''
  }

  ngAfterViewInit() {
    if (this.topBarListing && this.entityNamee !== 'Answer') {
      document.getElementById('update_date').classList.add('active')
    } else {
      try {
        document.getElementById('Date').classList.add('active')
        this.order = { ordering: true, orderBy: '-Date' }
      } catch (error) {}
    }
  }

  @Input()
  set listItem(list: any[]) {
    this.listItems = list
    this.calculateNumberOfPages()
    this.calculateRangeDisplay(this.pageNumber)
  }

  @Input()
  set structurelist(list: any) {
    this.structure = list
  }

  @Input()
  set countP(count: number) {
    this.count = count
    setTimeout(() => {
      this.calculateNumberOfPages()
      this.calculateRangeDisplay(this.pageNumber)
    }, 300)
  }

  @Input()
  set entityName(name: string) {
    this.entityNamee = name
  }

  @Input()
  set ActionListD(list: any) {
    this.actionsList = list
  }

  @Input()
  set actions(value: boolean) {
    this.actionsButtons = value
  }

  @Input()
  set topBar(value: boolean) {
    this.topBarListing = value
  }

  @Input()
  set paginationV(value: boolean) {
    this.pagination = value
  }

  @Input()
  set FilterItem1(value: any) {
    this.listFilter1 = value.list
    this.keynameFilter1 = value.key
    this.filter_name_model = value.filter_name_model
    this.filter_preposition1 = value.preposition
    if (value.type) {
      this.typeFilterDynamic = true
      this.displayErrors = false
      this.searchedItems = value.searchedItems
    }
  }

  @Input()
  set SelectedFilter1(value: any) {
    if (value) {
      this.selectedFilter1 = value
      this.filterisActive = true
    } else {
      this.filterisActive = false
    }
  }

  @Input()
  set FilterItem2(value: any) {
    this.listFilter2 = value.list
    this.keynameFilter2 = value.key
    this.filter_name_model2 = value.filter_name_model
  }

  @Input()
  set Filter1FromParent(value: any) {
    if (value) {
      this.changeFilter1(value)
    }
  }

  @Output() search: EventEmitter<string> = new EventEmitter()
  @Output() ordering: EventEmitter<string> = new EventEmitter()
  @Output() setPageE: EventEmitter<number> = new EventEmitter()
  @Output() delete: EventEmitter<number> = new EventEmitter()
  @Output() clone: EventEmitter<number> = new EventEmitter()
  @Output() edit: EventEmitter<number> = new EventEmitter()
  @Output() PageSize: EventEmitter<number> = new EventEmitter()
  @Output() Filter1: EventEmitter<any> = new EventEmitter()
  @Output() Filter2: EventEmitter<any> = new EventEmitter()
  @Output() displayMoreEv: EventEmitter<any> = new EventEmitter()
  @Output() searchFilter: EventEmitter<any> = new EventEmitter()
  @Output() filterSelect: EventEmitter<any> = new EventEmitter()
  @Output() trainingJob: EventEmitter<any> = new EventEmitter()
  @Output() files: EventEmitter<any> = new EventEmitter()
  @Output() addProject: EventEmitter<any> = new EventEmitter()
  @Output() start: EventEmitter<any> = new EventEmitter()
  @Output() stop: EventEmitter<any> = new EventEmitter()

  calculateNumberOfPages() {
    this.numberOfPages = this.utils.calculateNumberOfPages(
      this.count,
      this.page_size
    )
  }

  showhide(status: boolean = true) {
    if (status === false) {
      this.searchInput = false
      this.searchTerm = ''
      this.deatailsWhileSearching = false
      return
    }
    this.searchInput = !this.searchInput
    if (!this.searchInput) {
      this.deatailsWhileSearching = false
      this.searchTerm = ''
      this.search.emit(this.searchTerm)
    }
  }

  calculateRangeDisplay(page: number) {
    if (this.count < this.page_size) {
      this.count = this.listItems.length
      this.DisplayedRange = '1 - ' + this.count
    } else {
      const start = (page - 1) * this.page_size + 1
      const end = page * this.page_size
      if (end > this.count) {
        this.DisplayedRange = `${start}-${this.count}`
      } else {
        this.DisplayedRange = `${start}-${end}`
      }
    }
  }

  setPage(page: number) {
    if (page > 0 && page <= this.numberOfPages) {
      this.pageNumber = page
      this.setPageE.emit(this.pageNumber)
    }
  }

  counter(i: number) {
    const numberofPagesAll = new Array(i).fill(0).map((x, i) => i + 1)
    if (numberofPagesAll.length >= 10) {
      if (numberofPagesAll.slice(0, 4).includes(this.pageNumber)) {
        let NewNumberofPagesAll = numberofPagesAll.map((item: number) => {
          return item.toString()
        })
        NewNumberofPagesAll = NewNumberofPagesAll.slice(0, 5)
          .concat('...')
          .concat(NewNumberofPagesAll.slice(-2))
        return NewNumberofPagesAll
      } else if (
        numberofPagesAll
          .slice(4, numberofPagesAll.length - 4)
          .includes(this.pageNumber)
      ) {
        let NewNumberofPagesAll = numberofPagesAll.map((item: number) => {
          return item.toString()
        })
        NewNumberofPagesAll = NewNumberofPagesAll.slice(
          this.pageNumber - 3,
          this.pageNumber + 2
        )
          .concat('...')
          .concat(NewNumberofPagesAll.slice(-2))
        return NewNumberofPagesAll
      } else {
        let NewNumberofPagesAll = numberofPagesAll.map((item: number) => {
          return item.toString()
        })
        NewNumberofPagesAll = NewNumberofPagesAll.slice(0, 3)
          .concat('...')
          .concat(
            NewNumberofPagesAll.slice(this.pageNumber - 3, this.pageNumber + 2)
          )
        return NewNumberofPagesAll
      }
    } else {
      return new Array(i)
    }
  }

  orderList(orderBy: string, name: string = null) {
    const first_order_id = orderBy
    const sortBy = this.getSortBy(orderBy.replace('-', ''))
    if (sortBy) {
      orderBy = sortBy
      this.custom_Order = true
    } else {
      this.custom_Order = false
    }
    if (this.searchTerm) {
      this.deatailsWhileSearching = true
    }
    this.displayOrderText = ''
    this.order.ordering = true
    if (this.getKeyBysortBy(orderBy)) {
      try {
        document
          .getElementById(this.order.orderBy.replace('-', ''))
          .classList.remove('active')
      } catch (e) {
        document.getElementById(first_order_id).classList.remove('active')
      }

      document
        .getElementById(this.getKeyBysortBy(orderBy))
        .classList.add('active')
    } else {
      try {
        document
          .getElementById(this.order.orderBy.replace('-', ''))
          .classList.remove('active')
      } catch (e) {
        document
          .getElementById(
            this.getKeyBysortBy(this.order.orderBy.replace('-', ''))
          )
          .classList.remove('active')
      }

      document.getElementById(orderBy).classList.add('active')
    }

    if (
      orderBy === this.order.orderBy ||
      this.getKeyBysortBy(orderBy) === this.order.orderBy
    ) {
      this.order.orderBy = '-' + orderBy
    } else if (orderBy !== this.order.orderBy && this.custom_Order) {
      this.order.orderBy = this.getKeyBysortBy(orderBy)
    } else {
      this.order.orderBy = orderBy
    }
    this.displayOrderText = '| Order by : '
    if (name) {
      this.displayOrderText += name
    } else {
      this.displayOrderText +=
        orderBy.charAt(0).toUpperCase() + orderBy.slice(1)
    }
    if (this.order.orderBy.includes('-')) {
      this.displayOrderText += ' (Descending)'
    } else {
      this.displayOrderText += ' (Ascending)'
    }

    this.ordering.emit(orderBy)
  }

  showDetails(id: number) {
    if (this.details.open && this.details.id === id) {
      this.details.open = false
      this.details.id = null
    } else {
      if (this.searchTerm) {
        this.deatailsWhileSearching = true
      }
      this.details.id = id
      this.details.open = true
    }
  }

  onClickedOutside(e: Event, target: string) {
    if (
      target === 'search' &&
      !this.deatailsWhileSearching &&
      this.searchInput &&
      !this.searchTerm
    ) {
      this.showhide(false)
    } else if (target === 'details') {
      if (this.details.open && this.details.id) {
        this.details.open = false
        this.details.id = null
      }
    }
  }

  getKeyBytitle(title: string) {
    return this.structure.find((item: any) => item.title === title).key
  }

  getdoNotSort(title: string) {
    return this.structure.find((item: any) => item.title === title).doNotSort
  }

  getContentByKey(key: string) {
    return this.structure.find((item: any) => item.key === key).content
  }

  searchEvent() {
    this.pageNumber = 1
    this.search.emit(this.searchTerm)
    this.calculateRangeDisplay(this.pageNumber)
    this.setPageE.emit(this.pageNumber)
  }

  handleAction(action: string, id: number) {
    this.details = { id: null, open: false }
    if (action === 'delete') {
      this.delete.emit(id)
    }
    if (action === 'clone') {
      this.clone.emit(id)
    }
    if (action === 'edit') {
      this.edit.emit(id)
    }
    if (action === 'trainingJob') {
      this.trainingJob.emit(id)
    }
    if (action === 'files') {
      this.files.emit(id)
    }
    if (action === 'addproject') {
      this.addProject.emit(id)
    }
    if (action === 'start') {
      this.start.emit(id)
    }
    if (action === 'stop') {
      this.stop.emit(id)
    }
  }

  getlinkByKey(key: string) {
    try {
      return this.structure.find((item: any) => item.key === key).link
    } catch (e) {
      return ''
    }
  }

  getKeynamebyKey(key: string) {
    try {
      return this.structure.find((item: any) => item.key === key).link.keyname
    } catch (e) {
      return ''
    }
  }

  getWidth() {
    if (this.actionsButtons) {
      return 'width:' + (100 / (this.structure.length + 1)).toFixed(0) + '%'
    } else {
      return 'width:' + (100 / this.structure.length).toFixed(0) + '%'
    }
  }

  getSortBy(key: string) {
    return this.structure.find((item: any) => item.key === key).sort_key
  }

  getKeyBysortBy(sortBy: string) {
    try {
      return this.structure.find((item: any) => item.sort_key === sortBy).key
    } catch (e) {
      return null
    }
  }

  getExternalbyKey(key: string) {
    try {
      return this.structure.find((item: any) => item.key === key).link.external
    } catch (e) {
      return false
    }
  }

  changePageSize(page_size: any) {
    this.PageSize.emit(page_size)
    this.setPageE.emit(this.pageNumber)
    this.page_size = page_size
    this.pageNumber = 1
    this.calculateNumberOfPages()
    this.calculateRangeDisplay(this.pageNumber)
  }

  changeFilter1(id: number) {
    this.filter1Id = Number(id)
    this.filterisActive = true
    this.Filter1.emit(id)
    this.calculateNumberOfPages()
    this.calculateRangeDisplay(this.pageNumber)
  }

  cancelFilter1() {
    this.filterisActive = false
    this.filter1Id = null
    this.selectedFilter1 = null
    this.Filter1.emit('')
    this.calculateNumberOfPages()
    this.calculateRangeDisplay(this.pageNumber)
  }

  changeFilter2(id: any) {
    if (isNaN(id)) {
      this.filter2Id = id
    } else {
      this.filter2Id = Number(id)
    }
    this.filter2isActive = true
    this.Filter2.emit(id)
    this.calculateNumberOfPages()
    this.calculateRangeDisplay(this.pageNumber)
  }

  cancelFilter2() {
    this.filter2Id = null
    this.filter2isActive = false
    this.Filter2.emit('')
    this.calculateNumberOfPages()
    this.calculateRangeDisplay(this.pageNumber)
  }

  parseInt(i: any) {
    return parseInt(i)
  }

  displayMore(event: any) {
    this.displayMoreEv.emit(event)
  }

  searchE(event: any) {
    this.searchFilter.emit(event)
  }

  onChangedatalist(event: any) {
    this.filterisActive = true
    this.filterSelect.emit(event)
  }

  getTitleByAction(action: string) {
    return this.actionsList.find((item: any) => item.action === action).title
  }

  replaceText(text: string, original: string, rep: string) {
    return text.replace(original, rep)
  }
}
