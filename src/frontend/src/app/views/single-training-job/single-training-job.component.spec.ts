import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SingleTrainingJobComponent } from './single-training-job.component'

describe('SingleTrainingJobComponent', () => {
  let component: SingleTrainingJobComponent
  let fixture: ComponentFixture<SingleTrainingJobComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleTrainingJobComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTrainingJobComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
