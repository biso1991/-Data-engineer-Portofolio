import { DOCUMENT } from '@angular/common'
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core'
import { Model } from 'src/app/models/model.model'

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  styleUrls: ['./datalist.component.scss']
})
export class DatalistComponent implements OnInit, AfterViewInit {
  Term: string = ''
  selected: any
  newSelected: any = null
  editing: boolean = false
  filteredResult: any[]
  options: any[] = []
  nameItem: string
  inputValid: boolean = true
  error: string
  entityN: string = ''
  linkEntity: string = ''
  displayErrorsE: boolean = true
  offsetWidth: number = 0
  special: boolean

  @Input()
  set Special(value: boolean) {
    if (value) {
      this.special = true
    }
  }

  @Input()
  set selectedItem(selected: any) {
    if (selected) {
      this.selected = selected
    } else {
      this.selected = new Model()
    }
    if (this.nameItem && selected) {
      this.selected.chosen = true
      this.Term = selected[this.nameItem]
    }
  }

  @Input()
  set Isediting(edit: boolean) {
    this.editing = edit
  }

  @Input()
  set optionsList(options: any) {
    this.options = options['list']
    if (options['search']) {
      this.filteredResult = options['search']
    }
  }

  @Input()
  set name(name: string) {
    this.nameItem = name
  }

  @Input()
  set entity(name: string) {
    this.entityN = name
  }

  @Input()
  set link(value: string) {
    this.linkEntity = value
  }

  @Input()
  set displayErrors(value: boolean) {
    this.displayErrorsE = value
  }

  @Input()
  set cancel(value: boolean) {
    if (value) {
      this.filteredResult = []
      this.Term = ''
    }
  }

  @Output() Select: EventEmitter<number> = new EventEmitter()
  @Output() errorE: EventEmitter<boolean> = new EventEmitter()
  @Output() scrollBottom: EventEmitter<boolean> = new EventEmitter()
  @Output() search: EventEmitter<string> = new EventEmitter()
  constructor(@Inject(DOCUMENT) private document: any) {}

  ngOnInit(): void {
    this.filteredResult = []
  }

  filter() {
    if (this.Term) {
      // this.filteredResult = this.options.filter((item) =>
      //   item[this.nameItem].toLowerCase().includes(this.Term.toLowerCase())
      // )
      this.search.emit(this.Term)
      if (this.filteredResult.length === 0) {
        this.inputValid = false
        this.errorE.emit(true)
        this.error = 'No result found'
      } else {
        this.inputValid = true
        this.errorE.emit(false)
      }
    } else {
      this.inputValid = false
      this.errorE.emit(true)
      this.error = this.entityN + ' is required'
      this.filteredResult = this.options
    }
  }

  select(id: number) {
    this.newSelected = this.filteredResult.find((item) => item.id === id)
    this.selected.chosen = false
    // this.selected = this.filteredResult.find((item) => item.id === id)
    this.Term = this.newSelected[this.nameItem]
    this.inputValid = true
    this.errorE.emit(false)
    this.filteredResult = []
    this.Select.emit(id)
  }

  hide() {
    this.filteredResult = []
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['Isediting'] &&
      changes['Isediting']?.previousValue !==
        changes['Isediting']?.currentValue &&
      this.selected &&
      !this.editing
    ) {
      this.selected.chosen = true
      this.newSelected = null
      this.Term = this.selected[this.nameItem]
      this.inputValid = true
      this.Select.emit(this.selected.id)
    }

    const input = document.querySelector('#datalistinput') as HTMLElement | null
    if (input != null) {
      this.offsetWidth = input.offsetWidth
    }
  }

  ngAfterViewInit() {
    if (this.special) {
      const input1 = document.querySelector('#special') as HTMLElement | null
      if (input1 != null) {
        this.offsetWidth = input1.offsetWidth
      }
    }
  }

  verifyChosen() {
    try {
      if (this.selected.chosen) {
        return true
      } else {
        return false
      }
    } catch (error: any) {
      return false
    }
  }

  onScroll(event: any) {
    if (
      event.target.scrollHeight - event.target.scrollTop.toFixed(0) ===
      event.target.clientHeight
    ) {
      this.scrollBottom.emit(true)
    }
  }

  inputchanged(event: any) {
    this.search.emit(event)
  }
}
