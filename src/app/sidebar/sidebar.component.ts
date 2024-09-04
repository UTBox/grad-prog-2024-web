import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    console.log("welcome")
  }

  public createLeave(id: number) {
    this.router.navigate(['/leave-application']);
  }
}
