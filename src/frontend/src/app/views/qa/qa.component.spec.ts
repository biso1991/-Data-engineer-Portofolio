import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QAComponent } from './qa.component'

describe('QAComponent', () => {
  let component: QAComponent
  let fixture: ComponentFixture<QAComponent>

  // eslint-disable-next-line space-before-function-paren
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QAComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(QAComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
