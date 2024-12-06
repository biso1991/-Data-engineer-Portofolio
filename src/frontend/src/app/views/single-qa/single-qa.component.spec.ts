import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SingleQaComponent } from './single-qa.component'

describe('SingleQaComponent', () => {
  let component: SingleQaComponent
  let fixture: ComponentFixture<SingleQaComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleQaComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleQaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
