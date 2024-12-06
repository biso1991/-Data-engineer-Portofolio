import { TestBed } from '@angular/core/testing'

import { TrainingJobService } from './training-job.service'

describe('TrainingJobService', () => {
  let service: TrainingJobService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TrainingJobService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
