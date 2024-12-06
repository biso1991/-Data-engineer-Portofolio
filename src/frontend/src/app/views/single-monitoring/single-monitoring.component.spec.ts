import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SingleMonitoringComponent } from './single-monitoring.component'

describe('SingleMonitoringComponent', () => {
  let component: SingleMonitoringComponent
  let fixture: ComponentFixture<SingleMonitoringComponent>

  // eslint-disable-next-line space-before-function-paren
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleMonitoringComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleMonitoringComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
