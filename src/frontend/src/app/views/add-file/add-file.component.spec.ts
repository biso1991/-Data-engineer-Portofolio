import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AddFileComponent } from './add-file.component'

describe('AddFileComponent', () => {
  let component: AddFileComponent
  let fixture: ComponentFixture<AddFileComponent>

  // eslint-disable-next-line space-before-function-paren
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFileComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
