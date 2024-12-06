import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResetPasswordEmailComponent } from './reset-password-email.component'

describe('ResetPasswordEmailComponent', () => {
  let component: ResetPasswordEmailComponent
  let fixture: ComponentFixture<ResetPasswordEmailComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetPasswordEmailComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordEmailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
