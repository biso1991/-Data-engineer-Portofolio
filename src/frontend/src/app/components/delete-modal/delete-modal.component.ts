/* eslint-disable camelcase */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
  entityNamee: string
  entity: any
  itemsToDelete: any[]
  nameForRemove: string
  disabled: boolean
  entityNameKey: string = ''
  simple: boolean = false
  constructor() {}

  ngOnInit(): void {
    if (this.simple) {
      this.disabled = false
    } else {
      this.disabled = true
    }
  }

  @Input()
  set entityName(name: string) {
    this.entityNamee = name
  }

  @Input()
  set entityNameKeyP(name: string) {
    this.entityNameKey = name
  }

  @Input()
  set EntityToRemove(entity: any) {
    this.entity = entity
  }

  @Input()
  set itemsToRemove(items: any[]) {
    this.itemsToDelete = items
  }

  @Input()
  set SimpleModal(value: boolean) {
    this.simple = value
  }

  @Output() close: EventEmitter<any> = new EventEmitter()
  closeModal() {
    this.close.emit(null)
  }

  @Output() delete: EventEmitter<number> = new EventEmitter()
  DeleteItem() {
    if (!this.disabled && !this.entity.index) {
      this.delete.emit(this.entity.id)
    } else {
      this.delete_qa.emit({ id: this.entity.id, index: this.entity.index })
    }
  }

  @Output() delete_qa: EventEmitter<any> = new EventEmitter()
  Verify() {
    this.disabled = this.nameForRemove !== this.entity[this.entityNameKey]
  }
}
