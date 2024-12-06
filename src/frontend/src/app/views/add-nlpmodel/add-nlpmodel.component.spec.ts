/* eslint-disable space-before-function-paren */
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AddNlpmodelComponent } from './add-nlpmodel.component'

describe('AddNlpmodelComponent', () => {
  let component: AddNlpmodelComponent
  let fixture: ComponentFixture<AddNlpmodelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNlpmodelComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNlpmodelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
