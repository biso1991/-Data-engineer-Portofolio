import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TrainingJobComponent } from './training-job.component'

describe('TrainingJobComponent', () => {
  let component: TrainingJobComponent
  let fixture: ComponentFixture<TrainingJobComponent>

  // eslint-disable-next-line space-before-function-paren
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingJobComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingJobComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
