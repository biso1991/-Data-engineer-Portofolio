import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NlpmodelComponent } from './nlpmodel.component'

describe('NlpmodelComponent', () => {
  let component: NlpmodelComponent
  let fixture: ComponentFixture<NlpmodelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NlpmodelComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(NlpmodelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
