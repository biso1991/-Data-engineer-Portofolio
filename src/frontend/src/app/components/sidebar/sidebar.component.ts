import { Component, HostListener, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public innerWidth: any
  toggle: boolean
  profile: boolean = false
  project: boolean = false
  file: boolean = false
  model: boolean = false
  trainingJob: boolean = false

  constructor(
    private readonly router: Router,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth
    // if (this.innerWidth < 600) {
    //   this.toggle = true
    // } else {
    //   this.toggle = false
    // }
  }

  ngAfterViewInit() {
    // nabar enable / disable function
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.RouteHandler(event)
    //   }
    // })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth
    if (this.innerWidth < 600) {
      this.toggle = true
    }
  }

  @Input()
  set toogleFromDashboard(a: any) {
    this.sidebarToggle()
  }

  sidebarToggle() {
    this.toggle = !this.toggle
  }

  redirectTo(path: string, e: any) {
    e.stopPropagation()
    this.router.navigate([path])
  }
}
