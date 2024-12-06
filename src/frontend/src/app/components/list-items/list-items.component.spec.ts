import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ListItemsComponent } from './list-items.component'

describe('ListItemsComponent', () => {
  let component: ListItemsComponent
  let fixture: ComponentFixture<ListItemsComponent>

  // eslint-disable-next-line space-before-function-paren
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListItemsComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
