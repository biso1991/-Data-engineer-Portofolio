import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Project } from 'src/app/models/project.model'
import { TrainingJob } from 'src/app/models/training-job.model'
import { ProjectService } from 'src/app/services/project.service'
import { TrainingJobService } from 'src/app/services/training-job.service'
import { UtilsService } from 'src/app/services/utils.service'

@Component({
  selector: 'app-add-training-job',
  templateUrl: './add-training-job.component.html',
  styleUrls: ['./add-training-job.component.scss']
})
export class AddTrainingJobComponent implements OnInit {
  TrainingJob: TrainingJob
  projects: Project[] = []
  formisvalid: boolean = false
  searchedProject: Project[] = []
  nextPageProject: string = ''
  searchTerm: string = ''
  pageProject: number = 1
  selectedProject: Project = null
  isEditing: boolean = true
  constructor(
    private router: Router,
    private projectService: ProjectService,
    private utils: UtilsService,
    private trainingJobService: TrainingJobService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.TrainingJob = new TrainingJob()
    this.TrainingJob.project = null

    this.getProjectList()
  }

  getProjectList() {
    this.projectService
      .GetProjects(this.searchTerm, '', this.pageProject, 10)
      .subscribe({
        next: (data: any) => {
          // Not Searching
          if (this.searchTerm.length <= 1 && this.pageProject > 1) {
            this.projects.push(...data.results)
          } else if (this.searchTerm.length <= 1 && this.pageProject === 1) {
            this.projects = data.results
          }
          // Searching
          if (this.searchTerm.length > 1 && this.pageProject > 1) {
            this.searchedProject.push(...data.results)
          } else if (this.searchTerm.length > 1 && this.pageProject === 1) {
            this.searchedProject = data.results
          }
          this.nextPageProject = data.next
          if (this.nextPageProject !== null) {
            this.pageProject++
          } else {
            this.nextPageProject = ''
            this.pageProject = 1
          }
        },
        error: () => {
          this.projects = []
          this.utils.Notif('Error while getting projects', -1)
        }
      })
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'] && !isNaN(params['id'])) {
        this.TrainingJob.project = params['id']
        this.projectService.GetProjectById(params['id']).subscribe({
          next: (data: any) => {
            this.selectedProject = data
            this.isEditing = false
          },
          error: () => {
            this.utils.Notif('Error while getting project', -1)
          }
        })
      }
    })
  }

  verify(e: any, event: boolean = null) {
    if (this.TrainingJob.project) {
      event = false
    } else {
      event = true
    }
    if (!e.valid || event || event === null) {
      this.formisvalid = false
    } else if (e.valid && !event && event !== null) {
      this.formisvalid = true
    }
  }

  onChangedatalist($event: number, f: any) {
    this.TrainingJob.project = $event
    this.verify(f, false)
  }

  addTrainingJob() {
    this.trainingJobService.InsertTrainingJob(this.TrainingJob).subscribe({
      next: (data: any) => {
        this.utils.Notif('Training job added', 1)
        this.router.navigate(['/dashboard/training-job'])
      },
      error: () => {
        this.utils.Notif('Error while adding training job', -1)
      }
    })
  }

  displayMore(e: boolean) {
    if (e && this.nextPageProject) {
      this.getProjectList()
    }
  }

  searchProject(e: string) {
    this.searchTerm = e
    this.pageProject = 1
    if (e.length > 1) {
      this.searchTerm = e
    } else {
      this.searchTerm = ''
      this.TrainingJob.project = null
    }
    this.getProjectList()
  }
}
