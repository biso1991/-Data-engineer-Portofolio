import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AddTrainingJobComponent } from './add-training-job.component'

describe('AddTrainingJobComponent', () => {
  let component: AddTrainingJobComponent
  let fixture: ComponentFixture<AddTrainingJobComponent>

  // eslint-disable-next-line space-before-function-paren
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTrainingJobComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrainingJobComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
